import { formatItemsPerSecond } from "../../core/utils";
import { enumDirection, Vector } from "../../core/vector";
import { T } from "../../translations";
import { FilterComponent } from "../components/filter";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { ItemEjectorComponent } from "../components/item_ejector";
import { enumPinSlotType, WiredPinsComponent } from "../components/wired_pins";
import { Entity } from "../entity";
import { defaultBuildingVariant, MetaBuilding } from "../meta_building";
import { GameRoot } from "../root";
import { enumHubGoalRewards } from "../tutorial_goals";

/** @enum {string} */
export const enumFilterVariants = { dual: "dual" };

export class MetaFilterBuilding extends MetaBuilding {
    constructor() {
        super("filter");
    }

    getSilhouetteColor() {
        return "#c45c2e";
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_filter);
	}

    getDimensions() {
        return new Vector(2, 1);
	}
	
	    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant, enumFilterVariants.dual];
    }

    getShowWiresLayerPreview() {
        return true;
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const beltSpeed = root.hubGoals.getBeltBaseSpeed();
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(beltSpeed)]];
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new WiredPinsComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.left,
                        type: enumPinSlotType.logicalAcceptor,
                    },
                ],
            })
        );

        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                    },
                ],
            })
        );

        entity.addComponent(
            new ItemEjectorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.top,
                    },
                    {
                        pos: new Vector(1, 0),
                        direction: enumDirection.right,
                    },
                ],
            })
        );

        entity.addComponent(new FilterComponent());
	}
	
	/**
     *
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant: {
                entity.components.ItemEjector.setSlots([{
					pos: new Vector(0, 0),
					direction: enumDirection.top,
				},
				{
					pos: new Vector(1, 0),
					direction: enumDirection.right,
				}]);
                break;
            }
            case enumFilterVariants.dual: {
                entity.components.ItemEjector.setSlots([{
					pos: new Vector(0, 0),
					direction: enumDirection.top,
				},
				{
					pos: new Vector(1, 0),
					direction: enumDirection.top,
				}]);
                break;
            }

            default:
                assertAlways(false, "Unknown Filter variant: " + variant);
        }
    }
}
