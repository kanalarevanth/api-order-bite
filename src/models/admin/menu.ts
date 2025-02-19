import { model, Document, Schema, Model } from 'mongoose';
import { CommonSchemaProps, mongooseSchemaProps, mongooseSchemaOptions } from '../helpers/common-props';
import { deletePrivateProps } from '../helpers/private-props';
import { IAdminUser } from './admin-users';
import { IRestaurant } from './restaurants';

export enum CategoryEnum {
	'veg' = 'veg',
	'non-veg' = 'non-veg',
	'dessert' = 'dessert',
	'beverages' = 'beverages',
	'salads' = 'salads',
	'snacks' = 'snacks',
	'breakfast' = 'breakfast',
	'sweets' = 'sweets',
}

export type categoryType = 'veg' | 'non-veg' | 'dessert' | 'beverages' | 'salads' | 'snacks' | 'breakfast' | 'sweets';

export enum RecipeTypeEnum {
	'biryani' = 'biryani',
	'starters' = 'starters',
	'curries' = 'curries',
	'rice-dishes' = 'rice-dishes',
	'sandwiches' = 'sandwiches',
	'pizzas' = 'pizzas',
	'burgers' = 'burgers',
	'soups' = 'soups',
	'sweets' = 'sweets',
	'beverages' = 'beverages',
	'salads' = 'salads',
	'rotis' = 'rotis',
	'thalis' = 'thalis',
}

export type RecipeType =
	| 'biryani'
	| 'starters'
	| 'curries'
	| 'rice-dishes'
	| 'wrapsRolls'
	| 'sandwiches'
	| 'pizzas'
	| 'burgers'
	| 'soups'
	| 'sweets'
	| 'beverages'
	| 'salads'
	| 'rotis'
	| 'thalis';

export interface IRestaurantMenu
	extends Partial<Document>,
		CommonSchemaProps<IAdminUser>,
		DeepPartial<{
			name: string;
			description: string;
			price: number;
			category: categoryType;
			type: RecipeType;
			image: string;
			availability: boolean;
			restaurant: string | IRestaurant;
		}> {}

export interface IRestaurantMenuModel extends Model<IRestaurantMenu> {
	deletePrivateProps(data: IRestaurantMenu, deleteStatus?: boolean): IRestaurantMenu;
}

const RestaurantMenuSchema = new Schema<IRestaurantMenu, IRestaurantMenuModel>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			enum: CategoryEnum,
		},
		type: {
			type: String,
			enum: RecipeTypeEnum,
		},
		availability: {
			type: Boolean,
			default: true,
		},
		image: {
			type: String,
		},
		restaurant: {
			type: Schema.Types.ObjectId,
			ref: 'Restaurant',
		},
		...mongooseSchemaProps('AdminUser'),
	},
	{
		...mongooseSchemaOptions,
	},
);

RestaurantMenuSchema.statics.deletePrivateProps = (data: IRestaurantMenu, deleteStatus = true) => {
	deletePrivateProps(data, deleteStatus);
	return data;
};

RestaurantMenuSchema.index(
	{
		status: 1,
	},
	{
		name: 'main',
	},
);

RestaurantMenuSchema.index(
	{
		name: 'text',
	},
	{
		name: 'search',
		collation: {
			locale: 'simple',
		},
	},
);

export const RestaurantMenuModel = model<IRestaurantMenu, IRestaurantMenuModel>('RestaurantMenu', RestaurantMenuSchema);

RestaurantMenuModel.syncIndexes().catch((err) => {});
