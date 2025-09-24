import Peer, { type DataConnection } from 'peerjs'
import { getLocalPcID } from './util'
import { EventInType } from './eventInType';
const pcid = getLocalPcID();


interface PeerMessage<T> {
    from: string,
    body: T
}

export class PeerClient extends EventInType<{
    message: PeerMessage<string>
    [peerId: `message-${string}`]: string
}> {
    connections = new Map<string, DataConnection>();
    constructor() {
        super();
        window._peer = new Peer(pcid, {
            host: '81.68.166.249',
            port: 9000,
            key: '133CFFC5CF464FFEC81C457165E947FB',
            path: '/tbs',
            debug: 3
        });
        console.log('peer client created, id:', pcid);
        window._peer.on('error', (err) => {
            console.log('peer error', err);
        })
        window._peer.on("connection", (conn) => {
            console.log('connected to ', conn.peer);
            this.connections.set(conn.peer, conn);
            conn.on("data", (data) => {
                console.log('received data', data);
                this.emit('message', {
                    from: conn.peer,
                    body: data as string
                });
                this.emit(`message-${conn.peer}`, data as string)
            });
        });
    }
    async sendMessage(target: string, message: string) {
        const connection = this.connections.get(target);
        if (connection) {
            connection.send(message);
        } else {
            const newConnection = window._peer.connect(target);
            newConnection.on('open', () => {
                newConnection.send(message);
                this.connections.set(target, newConnection);
            })
        }
    }
}
export const peerClient = window.peerClient = new PeerClient(); 