import type { ModelDefinition } from "@llmgateway/models";

export const alibabaModels = [
	{
		model: "qwen-plus",
		deprecatedAt: undefined,
		deactivatedAt: undefined,
		providers: [
			{
				providerId: "alibaba",
				modelName: "qwen-plus",
				inputPrice: 0.4 / 1e6,
				outputPrice: 4.0 / 1e6,
				requestPrice: 0,
				contextSize: 32768,
				maxOutput: 8192,
				streaming: true,
				vision: false,
			},
		],
		jsonOutput: true,
	},
	{
		model: "qwen-turbo",
		deprecatedAt: undefined,
		deactivatedAt: undefined,
		providers: [
			{
				providerId: "alibaba",
				modelName: "qwen-turbo",
				inputPrice: 0.05 / 1e6,
				outputPrice: 0.2 / 1e6,
				requestPrice: 0,
				contextSize: 1000000,
				maxOutput: 8192,
				streaming: true,
				vision: false,
			},
		],
		jsonOutput: true,
	},
	{
		model: "qwen3-coder-plus",
		deprecatedAt: undefined,
		deactivatedAt: undefined,
		providers: [
			{
				providerId: "alibaba",
				modelName: "qwen3-coder-plus",
				requestPrice: 0,
				contextSize: 1000000,
				maxOutput: 66000,
				streaming: true,
				vision: false,
				inputPrice: undefined,
				outputPrice: undefined,
				pricingTiers: [
					{
						minContextSize: 0,
						maxContextSize: 32000,
						inputPrice: 1 / 1e6,
						outputPrice: 5 / 1e6,
					},
					{
						minContextSize: 32001,
						maxContextSize: 128000,
						inputPrice: 1.8 / 1e6,
						outputPrice: 9 / 1e6,
					},
					{
						minContextSize: 128001,
						maxContextSize: 256000,
						inputPrice: 3 / 1e6,
						outputPrice: 15 / 1e6,
					},
					{
						minContextSize: 256001,
						maxContextSize: 1000000,
						inputPrice: 6 / 1e6,
						outputPrice: 60 / 1e6,
					},
				],
			},
		],
		jsonOutput: true,
	},
] as const satisfies ModelDefinition[];
