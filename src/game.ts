import { clone, getLocalPcID, isNull, read, shuffle, write } from "./classes/util";
import { EventInType } from "./classes/eventInType";
import { computed, reactive, watch, type ComputedRef } from "vue";
import { Server } from "./server";
import { Client } from "./client";

export const stages = ['Welcome', 'Inviting', 'Morning', 'Night', 'Daylight', 'Evening', 'Result'];
export const skills: { [name: string]: Skill } = {
    vote: {
        name: 'vote',
        title: '投票',
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
        name: 'shooter',
        title: '枪击',
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
        name: 'revive',
        title: '复活',
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
        name: 'divination',
        title: '预言',
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
        name: 'justice',
        title: '裁决',
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
    /** 
     * 裁判 编号0 不参与游戏中，作为游戏发起方 数量为 1
     */
    { word: '裁', name: '裁判', camp: 'master' },
    /**
     * 狼人 编号1 狼人阵营 数量为 3
     */
    { word: '狼', name: '狼人', camp: 'wolf' },
    /**
     * 预言家 编号2 人类阵营 数量为 1
     */
    { word: '预', name: '预言家', camp: 'human' },
    /**
     * 女巫 编号3 人类阵营 数量为 1
     */
    { word: '巫', name: '女巫', camp: 'human' },
    /**
     * 猎人 编号4 人类阵营 数量为 1
     */
    { word: '猎', name: '猎人', camp: 'human' },
    /**
     * 平民 编号5 人类阵营 数量为 13
     */
    { word: '人', name: '平民', camp: 'human' },

    { word: '新', name: '未分配', camp: 'undefined' },
    { word: '迷', name: '未知', camp: 'undefined' },
];
// const defaultRule = {
//     1: 3, 2: 1, 3: 1, 4: 1, 5: 13
// }
const defaultRule = {
    1: 1, 2: 1, 3: 1, 5: 1
}

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
}

export class Game extends EventInType {
    pcid!: string
    state!: GameData
    server!: Server
    client!: Client
    opraters !: ComputedRef<Skill[]>
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
        this.state = reactive({
            logs: [],
            version: 0,
            players: [],
            stage: 'Welcome',
            chatMessages: [],
            voteBox: undefined
        });
        this.pcid = getLocalPcID()
        const lastState = this.read<GameData>('lastState', {
            logs: [],
            version: 0,
            players: [],
            stage: 'Welcome',
            chatMessages: [],
        })
        this.load(lastState)
        if (!this.server && this.isHost) {
            this.launcherServer()
        }
        this.opraters = computed(() => {

            return Object.values(skills);
        })
        console.log('this Game: ', this)
    }
    public load(data: any) {
        const { players, logs, version, stage, voteBox, dpsRank } = data
        this.state.players = players
        this.state.logs = logs
        this.state.version = version
        this.state.stage = stage
        this.state.voteBox = voteBox
        this.state.dpsRank = dpsRank
    }
    public reset() {
        this.load({
            logs: [],
            version: 0,
            players: [],
            stage: 'Welcome',
            chatMessages: [],
        })
    }
    public log(message: string) {
        this.state.logs.push({
            time: new Date().valueOf(),
            message: message
        })
        this.write('lastState', this.state)
    }
    public launcherServer() {
        this.server = new Server()
        this.server.on('join', ({ playerId, playerName }: { playerId: string; playerName: string; }) => {
            console.log('join', playerId, playerName)
            const player = {
                id: this.state.players.length,
                pcid: playerId,
                name: playerName,
                role: roles[6]!,
                alive: true
            }
            this.state.players.push(player);
            this.write('lastState', this.state)
            this.syncState(player);
        });
        watch(this.state, () => {
            this.state.players.forEach(player => {
                this.syncState(player)
            })
            this.write('lastState', this.state)
        })
    }
    public newGame(name: string) {
        this.reset()
        this.state.players.push({
            id: 0,
            pcid: this.pcid,
            name: name,
            role: roles[0]!,
            alive: true
        });
        this.state.stage = 'Inviting'
        this.launcherServer()
    }

    public async joinGame(hostId: string, name: string) {
        this.reset()
        this.client = new Client(hostId)
        await new Promise<void>((resolve, reject) => {
            this.client.on('state', state => {
                this.load(state)
                resolve()
            });
            this.client.join(name)
            setTimeout(() => {
                if (this.state.stage == 'Welcome') reject('join game timeout')
            }, 5000)
        })
        this.state.stage = 'Inviting'
        this.write('lastState', this.state)
    }

    public async syncState(target: Player) {
        const obj = clone(this.state)
        if (target.pcid === this.pcid) {
            return
        } else if (target.role.camp === 'wolf') {
            obj.players.forEach(player => {
                if (target.pcid === player.pcid) return
                if (player.role.camp === 'human') {
                    player.role = roles[7]!
                }
            });
        } else if (target.role.camp === 'human') {
            obj.players.forEach(player => {
                if (target.pcid === player.pcid) return
                if (player.role.camp != 'master') {
                    player.role = roles[7]!
                }
            });
        }
        if (!(['预言家', '裁判'].includes(target.role.name))) {
            delete obj.dpsRank;
        }
        this.server.sendState(target.pcid, obj)
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

    public assignRole(rule: { [key: string]: number } = defaultRule) {
        const roleDepot = [];
        for (let i in rule) {
            for (let j = 0; j < rule[i]!; j++) {
                roleDepot.push(roles[Number(i)]!)
            }
        }
        const suffled = shuffle(roleDepot);
        this.state.players.slice(1).forEach(player => {
            player.role = suffled.pop()!
        })
        this.state.stage = 'Night'
        this.write('lastState', this.state)
    }
}