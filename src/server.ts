import { EventInType } from './classes/eventInType';
export class Server extends EventInType<{
    heart: string
    skill: { playerId: string, skillName: skillName, targetId: string }
    join: { playerId: string, playerName: string }
    chat: { playerId: string, message: string }
}> {
    hostid: string;
    connected: boolean = false;
    constructor(hostid: string) {
        super();
        this.hostid = hostid;
        window.peerClient.on(`message`, message => {
            const from = message.from;
            const obj = JSON.parse(message.body);
            if (obj.type === 'heart') {
                this.emit('heart', from);
            } else if (obj.type === 'skill') {
                this.emit('skill', { playerId: from, skillName: obj.skillName, targetId: obj.targetId });
            } else if (obj.type === 'join') {
                this.emit('join', { playerId: from, playerName: obj.playerName });
            } else if (obj.type === 'chat') {
                this.emit('chat', { playerId: from, message: obj.message });
            }
        });
        this._connect();
    }
    protected async _connect() {
        if (this.connected) {
            return;
        }
        await new Promise<void>((resolve, reject) => {
            window.peerClient.once(`message-${this.hostid}`, message => {
                if (JSON.parse(message).type === 'connect') {
                    this.connected = true;
                    resolve();
                }
            });
            window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'connect' }));
            setTimeout(() => {
                if (!this.connected) { reject('Connection timed out'); }
            }, 10000);

        });
        this._heartbeat();
    }
    protected async _heartbeat() {
        setInterval(() => {
            window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'heart' }));
        }, 100);
    }
    public async syncState(state: GameData) {
        await window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'state', state }));
    }
}