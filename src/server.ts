import { EventInType } from './classes/eventInType';
export class Server extends EventInType<{
    heart: string
    skill: { playerId: string, skillName: skillName, targetId: string }
    join: { playerId: string, playerName: string }
    chat: { playerId: string, message: string }
}> {
    connected: boolean = false;
    constructor() {
        super();
        window.peerClient.on(`message`, message => {
            const from = message.from;
            const obj = JSON.parse(message.body);
            console.log('message', obj)
            if (obj.type === 'heart') {
                this.emit('heart', from);
            } else if (obj.type === 'skill') {
                this.emit('skill', { playerId: from, skillName: obj.skillName, targetId: obj.targetId });
            } else if (obj.type === 'join') {
                this.emit('join', { playerId: from, playerName: obj.name });
            } else if (obj.type === 'chat') {
                this.emit('chat', { playerId: from, message: obj.message });
            } else if (obj.type === 'connect') {
                window.peerClient.sendMessage(from, JSON.stringify({ type: 'connect' }));
            }
        });
        this._connect();
    }
    protected async _connect() {
        if (this.connected) {
            return;
        }

    }

    public async sendState(target: string, state: GameData) {
        await window.peerClient.sendMessage(target, JSON.stringify({ type: 'state', state }));
    }
}