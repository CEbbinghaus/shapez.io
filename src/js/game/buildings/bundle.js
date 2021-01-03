import { generateMatrixRotations } from "../../core/utils";
import {
    arrayAllDirections,
    enumDirection,
    enumDirectionToVector,
    enumInvertedDirections,
    Vector,
} from "../../core/vector";
import { BundleComponent } from "../components/bundle";
import { Entity } from "../entity";
import { MetaBuilding, defaultBuildingVariant } from "../meta_building";
import { GameRoot } from "../root";
import { enumHubGoalRewards } from "../tutorial_goals";

/** @enum {string} */
export const enumBundleVariants = {
    TIntersection: "t_intersection",
};

const wireTunnelsOverlayMatrix = {
    [defaultBuildingVariant]: generateMatrixRotations([0, 1, 0, 1, 1, 1, 0, 1, 0]),
    [enumBundleVariants.TIntersection]: generateMatrixRotations([0, 0, 0, 1, 1, 1, 0, 1, 0]),
};

/**
 * Enum of Objects containing the Tunnel Variant Connections
 * @enum {Object.<string, Array<Vector>>}
 */
export const ConnectionDirections = {
    [defaultBuildingVariant]: BuildConnections([
        new Vector(0, -1),
        new Vector(0, 1),
        new Vector(-1, 0),
        new Vector(1, 0),
    ]),
    [enumBundleVariants.TIntersection]: BuildConnections([
        new Vector(0, -1),
        new Vector(1, 0),
        new Vector(-1, 0),
    ]),
};

export class MetaBundleBuilding extends MetaBuilding {
    constructor() {
        super("bundle");
    }

    getSilhouetteColor() {
        return "#777a86";
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_wires_painter_and_levers);
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant, enumBundleVariants.TIntersection];
    }

    /**
     * @param {number} rotation
     * @param {number} rotationVariant
     * @param {string} variant
     * @param {Entity} entity
     */
    getSpecialOverlayRenderMatrix(rotation, rotationVariant, variant, entity) {
        return wireTunnelsOverlayMatrix[variant][rotation];
    }

    getIsRotateable() {
        return true;
    }

    getStayInPlacementMode() {
        return true;
    }

    getDimensions() {
        return new Vector(1, 1);
    }

    /** @returns {"wires"} **/
    getLayer() {
        return "wires";
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new BundleComponent({
                Connections: ConnectionDirections[defaultBuildingVariant],
            })
        );
    }

    /**
     *
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        if (entity.components.Bundle) {
            entity.components.Bundle.UpdateConnections(ConnectionDirections[variant]);
        }
    }
}

/**
 * Builds the Connection Graph object from the input Array
 * @param {Array<Vector>} Connections
 * @returns {Object.<string, Array<Vector>>}
 */
function BuildConnections(Connections) {
    /**
     * @type {Object.<string, Array<Vector>>}
     */
    let res = {};
    for (let i = 0; i < Connections.length; ++i) {
        const hash = Connections[i].toString();
        res[hash] = [];
    }

    for (let prop in res) {
        for (let i = 0; i < Connections.length; ++i) {
            const connection = Connections[i];
            if (prop == connection.toString()) continue;

            res[prop].push(connection.rotateFastMultipleOf90(180));
        }
    }

    // const ahash = a.toString();
    // if (!res[ahash]) {
    // 	res[ahash] = b;
    // }
    // let alta = a.rotateFastMultipleOf90(180);
    // let altb = b.rotateFastMultipleOf90(180);
    // const bhash = altb.toString();
    // if (!res[bhash]) {
    // 	res[bhash] = alta;
    // }
    return res;
}
