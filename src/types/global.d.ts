import type Peer from "peerjs";
import { type PeerClient } from "../classes/peer";

declare global {
    interface Window {
        _peer: Peer;
        peerClient: PeerClient;
    }
}