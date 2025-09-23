import { getLocalPcID, isNull, read, write } from "./classes/util";


type stage = 'Welcome' | 'Inviting' | 'Morning' | 'Night' | 'Voting' | 'Evening' | 'Result';
const stages = ['Welcome', 'Inviting', 'Morning', 'Night', 'Voting', 'Evening', 'Result'];


interface Skill {
    name: string;
    stages: stage[];
    getCandidate(game: Game): Player[];
    use: (game: Game, targetId: Player) => void;
}

const voteSkill: Skill = {
    name: '投票',
    stages: ['Voting'],
    getCandidate(game: Game): Player[] {
        return game.state.players.filter((player) =>
            (player.pcid !== game.pcid)
            && (player.role.camp !== 'master')
            && (player.alive == true)
        )
    },
    use(game: Game, target: Player) {
        if (game.state.voteBox == undefined) {
            throw new Error('投票箱未初始化')
        } else {
            game.state.voteBox!.push(game.player!.id, target.id)
        }
    }
}
const shooterSkill: Skill = {
    name: '枪击',
    stages: ['Night'],
    getCandidate(game: Game): Player[] {
        return game.state.players.filter((player) =>
            (player.pcid !== game.pcid)
            && (player.role.camp !== 'master')
            && (player.alive == true)
        )
    },
    use(game: Game, target: Player) {

    }
}

export interface Role {
    word: string;
    name: string;
    camp?: 'human' | 'wolf' | 'master' | 'unknown' | 'undefined';
}
const roles: Role[] = [
    // master
    { word: '裁', name: '裁判', camp: 'master' }, // 0
    // wolf
    { word: '狼', name: '狼人', camp: 'wolf' }, // 1
    // human
    { word: '预', name: '预言家', camp: 'human' }, // 2
    { word: '巫', name: '女巫', camp: 'human' }, // 3
    { word: '人', name: '平民', camp: 'human' }, // 4
    { word: '猎', name: '守卫', camp: 'human' }, // 5
]


class Vote {
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
interface Player {
    id: number
    pcid: string
    name: string
    role: Role
    alive: boolean
}
class Log {
    message: string = ''
    time: number = 0
}

interface GameData {
    players: Player[]
    logs: Log[]
    version: number
    stage: stage
}
class GameState {
    players: Player[] = [];
    logs: Log[] = [];
    version: number = 0;
    stage: stage = 'Welcome'
    voteBox?: Vote;

    public read(data: any) {
        if (data.players) {
            this.players = data.players;
        }
        if (data.logs) {
            this.logs = data.logs;
        }
        if (data.version) {
            this.version = data.version;
        }
        if (data.stage) {
            this.stage = data.stage;
        }
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

export class Game {
    pcid!: string;
    player?: Player;
    state: GameState = new GameState();
    constructor() {
        this.pcid = getLocalPcID();
        const lastState = this.read<GameData>('lastState', {
            players: [],
            logs: [],
            version: 0,
            stage: 'Welcome'
        });
        this.state.read(lastState);
        console.log("GAME", this);
    }

    public newGame() {
        this.state = new GameState();
        this.state.stage = 'Inviting';
        this.write('lastState', this.state.output());
    }



    public read<T>(key: string, defaultValue: T) {
        const last = read(`${this.pcid}#${key}`);
        if (isNull(last)) {
            return defaultValue;
        }
        return last as T;
    }

    public write(key: string, value: any) {
        return write(`${this.pcid}#${key}`, value);
    }
}