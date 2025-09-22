interface Role {
    name: string;
    camp: 'human' | 'wolf' | 'unknown'
}

class Vote {
    box: number[] = []
    public push(targetId: number) {
        this.box.push(targetId)
    }
    public getVoteResult(): number {
        const map = new Map<number, number>()
        for (let i = 0; i < this.box.length; i++) {
            const id = this.box[i]!
            if (map.has(id)) {
                map.set(id, map.get(id)! + 1)
            } else {
                map.set(id, 1)
            }
        }
        return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0]![0];
    }
}
class Player {
}
class Log {

}
class GameState {
    players: Player[] = [];
    logs: Log[] = [];
    version: number = 0;
    stage: 'Welcome' | 'Inviting' | 'Night' | 'Voting' | 'Evening' | 'Result' = 'Welcome'

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
    public output(): any {
        return {
            players: this.players,
            logs: this.logs,
            version: this.version,
            stage: this.stage
        }
    }
}

class Game {
    state: GameState = new GameState();
}