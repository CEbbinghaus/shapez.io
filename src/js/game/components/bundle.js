import {
    arrayAllDirections,
    enumDirection,
    enumDirectionToVector,
    enumInvertedDirections,
    Vector,
} from "../../core/vector";
import { Component } from "../component";
import { defaultBuildingVariant } from "../meta_building";

export class BundleComponent extends Component {
    static getId() {
        return "Bundle";
    }

    /**
     *
     * @param {{Connections: Object.<string, Array<Vector>>}} Elements
     */
    constructor({ Connections = {} }) {
        super();
        /**
         * @type {Object.<string, Array<Vector>>}
         */
        this.Connections = Connections;

        /**
         * Linked network, only if its not multiple directions
         * @type {Array<import("../systems/wire").WireNetwork>}
         */
        this.linkedNetworks = [];
    }

    /**
     * @param {Object.<string, Array<Vector>>} Connections
     */
    UpdateConnections(Connections) {
        this.Connections = Connections;
    }

    /**
     * Returns if the Tunnel accepts inputs from the given direction
     * @param {Vector} dir
     * Local Space Vector into the Tunnel
     */
    CanConnect(dir) {
        return !!this.Connections[dir.toString()];
    }

    /**
     * Returns if the Tunnel accepts inputs from the given direction
     * @param {import("./static_map_entity").StaticMapEntityComponent} staticComp
     * Static Map Entity Component
     * @param {Vector} dir
     * World space Vector into the Tunnel
     */
    CanConnectWorld(staticComp, dir) {
        const inputDir = staticComp.unapplyRotationToVector(dir);
        return !!this.Connections[inputDir.toString()];
    }

    /**
     * Returns the Worldspace Vector out from the Tunnel or Null
     * @param {import("./static_map_entity").StaticMapEntityComponent} staticComp
     * Static Map Entity Component
     * @param {Vector|null} input
     * Worldspace Direction into the Tunnel
     */
    GetOutputDirections(staticComp, input) {
        const inputDir = staticComp.unapplyRotationToVector(input);
        if (this.CanConnect(inputDir)) {
            let out = this.Connections[inputDir.toString()];
            return out.map(staticComp.applyRotationToVector.bind(staticComp));
        }
        return null;
    }
}
