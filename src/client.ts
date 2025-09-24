import { EventInType } from './classes/eventInType';
export class Client extends EventInType<{
    heart: void
    state: GameData
}> {
    hostid: string;
    connected: boolean = false;
    constructor(hostid: string) {
        super();
        this.hostid = hostid;
        window.peerClient.on(`message-${this.hostid}`, message => {
            const obj = JSON.parse(message);
            if (obj.type === 'heart') {
                this.emit('heart');
            }
            if (obj.type === 'state') {
                this.emit('state', obj.state);
            }
        });
        this.connect();
    }
    async connect() {
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
        this.heartbeat();
    }
    async heartbeat() {
        setInterval(() => {
            window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'heart' }));
        }, 100);
    }
    async useSkill(skillName: string, targetId?: string) {
        window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'skill', skillName, targetId }));
    }

    async join(name: string) {
        window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'join', name }));
    }
    async chat(message: string) {
        window.peerClient.sendMessage(this.hostid, JSON.stringify({ type: 'chat', message }));
    }
}