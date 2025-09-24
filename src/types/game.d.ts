type stage = 'Welcome' | 'Inviting' | 'Morning' | 'Night' | 'Daylight' | 'Evening' | 'Result'
type camp = 'human' | 'wolf' | 'master' | 'unknown' | 'undefined'
type eventName =
    | 'game-new' | 'game-start'
    | 'player-join' | 'player-vote' | 'player-die'
    | 'morning-start' | 'morning-end' | 'night-start' | 'night-end' | 'daylight-start' | 'daylight-end' | 'evening-start' | 'evening-end'
    | 'message' | 'skill'

type roleName = '裁判' | '狼人' | '预言家' | '女巫' | '女巫' | '平民' | '猎人' | '未知' | '未分配'
type skillName = 'vote' | 'shooter' | 'revive' | 'divination' | 'justice'

interface Event {
    name: eventName
    data: {
        game: Game,
        player?: Player
        target?: Player
    }
}

interface Skill {
    name: string
    stages: stage[]
    roles: roleName[]
    getCandidate(game: Game): Player[]
    use: (game: Game, target?: Player) => void
}
interface Role {
    word: string
    name: roleName
    camp?: camp
}
interface Player {
    id: number
    pcid: string
    name: string
    role: Role
    alive: boolean
}
interface GameMessage {
    player: Player | 'system'
    message: string
}
interface GameData {
    players: Player[]
    logs: Log[]
    chatMessages: GameMessage[]
    version: number
    stage: stag
    voteBox?: VoteBox
    dpsRank?: string
}

interface Log {
    message: string = ''
    time: number = 0
}
