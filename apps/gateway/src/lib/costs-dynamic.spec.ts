import { describe, it, expect } from "vitest";

import { calculateCosts } from "./costs";

describe("Dynamic Pricing", () => {
	it("should use lower tier pricing for context size <= 128,000 tokens", () => {
		const result = calculateCosts(
			"grok-4-0709",
			"xai",
			100000, // 100k tokens (below threshold)
			50000, // 50k tokens
			null,
			undefined,
			100000, // context size
		);

		expect(result.inputCost).toBe(100000 * (3.0 / 1e6)); // $3/M
		expect(result.outputCost).toBe(50000 * (15.0 / 1e6)); // $15/M
		expect(result.totalCost).toBe(
			(result.inputCost || 0) + (result.outputCost || 0),
		);
	});

	it("should use higher tier pricing for context size > 128,000 tokens", () => {
		const result = calculateCosts(
			"grok-4-0709",
			"xai",
			150000, // 150k tokens (above threshold)
			50000, // 50k tokens
			null,
			undefined,
			150000, // context size
		);

		expect(result.inputCost).toBe(150000 * (6.0 / 1e6)); // $6/M
		expect(result.outputCost).toBe(50000 * (30.0 / 1e6)); // $30/M
		expect(result.totalCost).toBe(
			(result.inputCost || 0) + (result.outputCost || 0),
		);
	});

	it("should use cached input price for both tiers", () => {
		const result1 = calculateCosts(
			"grok-4-0709",
			"xai",
			100000, // 100k tokens
			50000, // 50k tokens
			20000, // 20k cached tokens
			undefined,
			100000, // context size (lower tier)
		);

		const result2 = calculateCosts(
			"grok-4-0709",
			"xai",
			150000, // 150k tokens
			50000, // 50k tokens
			20000, // 20k cached tokens
			undefined,
			150000, // context size (higher tier)
		);

		// Both should use the same cached price
		expect(result1.cachedInputCost).toBe(20000 * (0.75 / 1e6)); // $0.75/M
		expect(result2.cachedInputCost).toBe(20000 * (0.75 / 1e6)); // $0.75/M
	});

	it("should fallback to base pricing when no dynamic pricing is defined", () => {
		const result = calculateCosts(
			"gpt-4o-mini",
			"openai",
			100000, // 100k tokens
			50000, // 50k tokens
			null,
			undefined,
			200000, // context size doesn't matter for non-dynamic models
		);

		// Should use the base pricing from the model definition
		expect(result.inputCost).toBe(100000 * (0.15 / 1e6)); // GPT-4o-mini pricing
		expect(result.outputCost).toBe(50000 * (0.6 / 1e6)); // GPT-4o-mini pricing
	});
});
