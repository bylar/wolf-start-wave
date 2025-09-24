import { getLocalPcID, isNull, read, write } from "./classes/util";
import { EventInType } from "./classes/eventInType";

export const stages = ['Welcome', 'Inviting', 'Morning', 'Night', 'Daylight', 'Evening', 'Result'];
export const skills: { [name: string]: Skill } = {
    vote: {
        name: '投票',
        stages: ['Daylight'],
        roles: ['平民', '猎人', '狼人', '女巫', '预言家'],
        getCandidate(game: Game): Player[] {
            return game.state.players.filter((player) =>
                (player.pcid !== game.pcid)
                && (player.role.camp !== 'master')
                && (player.alive == true)
            )
        },
        use(game: Game, from?: Player, target?: Player) {
            if (target) {
                game.state.voteBox!.push(from!.id, target!.id)
                game.log(`${from!.name}投给了${target!.name}!`);
            } else {
                game.log(`${from!.name}弃权了!`);
            }
        }
    },
    shooter: {
        name: '枪击',
        stages: ['Evening'],
        roles: ['猎人'],
        getCandidate(game: Game): Player[] {
            return game.state.players.filter((player) =>
                (player.pcid !== game.pcid)
                && (player.role.camp !== 'master')
                && (player.alive == true)
            )
        },
        use(game: Game, from?: Player, target?: Player) {
            if (target) {
                game.state.players.find((player) => player.id == target!.id)!.alive = false;
                game.log(`猎手${from!.name}枪杀了${target!.name}!`);
            }
        }
    },
    revive: {
        name: '复活',
        stages: ['Evening'],
        roles: ['女巫'],
        getCandidate(game: Game): Player[] {
            return game.state.players.filter((player) =>
                (player.pcid !== game.pcid)
                && (player.role.camp !== 'master')
                && (player.alive == false)
            )
        },
        use(game: Game, from?: Player, target?: Player) {
            if (target) {
                game.state.players.find((player) => player.id == target!.id)!.alive = true;
                game.log(`女巫${from!.name}复活了${target!.name}!`);
            }
        }
    },
    divination: {
        name: '预言',
        stages: ['Morning'],
        roles: ['预言家'],
        getCandidate(game: Game): Player[] {
            return game.state.players.filter((player) =>
                (player.pcid !== game.pcid)
                && (player.role.camp !== 'master')
                && (player.alive == true)
            )
        },
        use(game: Game, from?: Player, target?: Player) {

        }
    },
    justice: {
        name: '裁决',
        stages: ['Evening'],
        roles: ['裁判'],
        getCandidate(_game: Game): Player[] {
            return []
        },
        use(game: Game, from?: Player, target?: Player) {

        }
    }
};
export const roles: Role[] = [
    // master
    { word: '裁', name: '裁判', camp: 'master' }, // 0
    // wolf
    { word: '狼', name: '狼人', camp: 'wolf' }, // 1
    // human
    { word: '预', name: '预言家', camp: 'human' }, // 2
    { word: '巫', name: '女巫', camp: 'human' }, // 3
    { word: '人', name: '平民', camp: 'human' }, // 4
    { word: '猎', name: '猎人', camp: 'human' }, // 5
];

export class VoteBox {
    box: { [key: number]: number } = {}
    public push(playerId: number, targetId: number) {
        this.box[playerId] = targetId
    }
    public getVoteResult(): number {
        const map = new Map<number, number>();
        const box = Object.values(this.box)
        for (let i = 0; i < box.length; i++) {
            const id = box[i]!
            if (map.has(id)) {
                map.set(id, map.get(id)! + 1)
            } else {
                map.set(id, 1)
            }
        }
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0]![0];
    }
}



export class GameState implements GameData {
    stage: stage = 'Welcome'
    logs: Log[] = []
    players: Player[] = []
    chatMessages: GameMessage[] = []
    version: number = 0
    voteBox?: VoteBox
    dpsRank?: string

    public read(data: any) {
        const { players, logs, version, stage, voteBox, dpsRank } = data
        this.players = players
        this.logs = logs
        this.version = version
        this.stage = stage
        this.voteBox = voteBox
        this.dpsRank = dpsRank
    }
    public output(): GameData {
        return {
            players: this.players,
            logs: this.logs,
            version: this.version,
            stage: this.stage
        } as GameData
    }
}

export class Game extends EventInType {
    pcid!: string
    state: GameState = new GameState()
    get player() {
        return this.state.players.find((player) => player.pcid == this.pcid)
    }
    get host() {
        return this.state.players.find((player) => player.role.name === '裁判')
    }
    get isHost() {
        return this.player?.role.name === '裁判'
    }
    constructor() {
        super()
        this.pcid = getLocalPcID()
        const lastState = this.read<GameData>('lastState', {
            logs: [],
            version: 0,
            players: [],
            stage: 'Welcome',
            chatMessages: [],
        })
        this.state.read(lastState)
        console.log('this Game: ', this)
    }

    public log(message: string) {
        this.state.logs.push({
            time: new Date().valueOf(),
            message: message
        })
        this.write('lastState', this.state.output())
    }

    public newGame(name: string) {
        this.state = new GameState()
        this.state.players.push({
            id: 0,
            pcid: this.pcid,
            name: name,
            role: roles[0]!,
            alive: true
        });
        this.state.stage = 'Inviting'
        this.write('lastState', this.state.output())
    }

    public read<T>(key: string, defaultValue: T) {
        const last = read(`${this.pcid}#${key}`)
        if (isNull(last)) {
            return defaultValue
        }
        return last as T
    }

    public write(key: string, value: any) {
        return write(`${this.pcid}#${key}`, value)
    }
}