import { describe, expect, it } from "vitest";

import { calculateCosts } from "./costs";

describe("calculateCosts", () => {
	it("should calculate costs with provided token counts", () => {
		const result = calculateCosts("gpt-4", "openai", 100, 50, null);

		expect(result.inputCost).toBeCloseTo(0.001); // 100 * 0.00001
		expect(result.outputCost).toBeCloseTo(0.0015); // 50 * 0.00003
		expect(result.totalCost).toBeCloseTo(0.0025); // 0.001 + 0.0015
		expect(result.promptTokens).toBe(100);
		expect(result.completionTokens).toBe(50);
		expect(result.cachedTokens).toBeNull();
		expect(result.estimatedCost).toBe(false); // Not estimated
	});

	it("should calculate costs with null token counts but provided text", () => {
		const result = calculateCosts("gpt-4", "openai", null, null, null, {
			prompt: "Hello, how are you?",
			completion: "I'm doing well, thank you for asking!",
		});

		// The exact token counts will depend on the tokenizer, but we can check that they're calculated
		expect(result.promptTokens).toBeGreaterThan(0);
		expect(result.completionTokens).toBeGreaterThan(0);
		expect(result.inputCost).toBeGreaterThan(0);
		expect(result.outputCost).toBeGreaterThan(0);
		expect(result.totalCost).toBeGreaterThan(0);
		expect(result.estimatedCost).toBe(true); // Should be estimated
	});

	it("should calculate costs with null token counts but provided chat messages", () => {
		const result = calculateCosts("gpt-4", "openai", null, null, null, {
			messages: [
				{ role: "user", content: "Hello, how are you?" },
				{ role: "assistant", content: "I'm doing well, thank you for asking!" },
			],
			completion: "I'm doing well, thank you for asking!",
		});

		// The exact token counts will depend on the tokenizer, but we can check that they're calculated
		expect(result.promptTokens).toBeGreaterThan(0);
		expect(result.completionTokens).toBeGreaterThan(0);
		expect(result.inputCost).toBeGreaterThan(0);
		expect(result.outputCost).toBeGreaterThan(0);
		expect(result.totalCost).toBeGreaterThan(0);
		expect(result.estimatedCost).toBe(true); // Should be estimated
	});

	it("should return null costs when model info is not found", () => {
		// Using a valid model with an invalid provider to test the not-found path
		const result = calculateCosts(
			"gpt-4",
			"non-existent-provider",
			100,
			50,
			null,
		);

		expect(result.inputCost).toBeNull();
		expect(result.outputCost).toBeNull();
		expect(result.totalCost).toBeNull();
		expect(result.promptTokens).toBe(100);
		expect(result.completionTokens).toBe(50);
		expect(result.cachedTokens).toBeNull();
		expect(result.estimatedCost).toBe(false); // Not estimated
	});

	it("should return null costs when token counts are null and no text is provided", () => {
		const result = calculateCosts("gpt-4", "openai", null, null, null);

		expect(result.inputCost).toBeNull();
		expect(result.outputCost).toBeNull();
		expect(result.totalCost).toBeNull();
		expect(result.promptTokens).toBeNull();
		expect(result.completionTokens).toBeNull();
		expect(result.cachedTokens).toBeNull();
		expect(result.estimatedCost).toBe(false); // Not estimated
	});

	it("should calculate costs with cached tokens", () => {
		const result = calculateCosts("gpt-4o", "openai", 100, 50, 20);

		expect(result.inputCost).toBeCloseTo(0.00025); // 100 * 0.0000025
		expect(result.outputCost).toBeCloseTo(0.0005); // 50 * 0.00001
		expect(result.cachedInputCost).toBeCloseTo(0.000025); // 20 * 0.00000125
		expect(result.totalCost).toBeCloseTo(0.000575); // 0.00025 + 0.0005 + 0.000025
		expect(result.promptTokens).toBe(100);
		expect(result.completionTokens).toBe(50);
		expect(result.cachedTokens).toBe(20);
		expect(result.estimatedCost).toBe(false); // Not estimated
	});

	it("should calculate costs using pricing tiers based on context size", () => {
		// Test qwen3-coder-plus with different context sizes

		// Small context (0-32K): should use first tier ($1/$5 per million)
		const smallResult = calculateCosts(
			"qwen3-coder-plus",
			"alibaba",
			15000,
			5000,
			null,
		);
		expect(smallResult.inputCost).toBeCloseTo(0.015); // 15000 * (1/1e6)
		expect(smallResult.outputCost).toBeCloseTo(0.025); // 5000 * (5/1e6)
		expect(smallResult.totalCost).toBeCloseTo(0.04); // 0.015 + 0.025

		// Medium context (32K-128K): should use second tier ($1.8/$9 per million)
		const mediumResult = calculateCosts(
			"qwen3-coder-plus",
			"alibaba",
			50000,
			20000,
			null,
		);
		expect(mediumResult.inputCost).toBeCloseTo(0.09); // 50000 * (1.8/1e6)
		expect(mediumResult.outputCost).toBeCloseTo(0.18); // 20000 * (9/1e6)
		expect(mediumResult.totalCost).toBeCloseTo(0.27); // 0.09 + 0.18

		// Large context (256K-1M): should use fourth tier ($6/$60 per million)
		const largeResult = calculateCosts(
			"qwen3-coder-plus",
			"alibaba",
			300000,
			100000,
			null,
		);
		expect(largeResult.inputCost).toBeCloseTo(1.8); // 300000 * (6/1e6)
		expect(largeResult.outputCost).toBeCloseTo(6.0); // 100000 * (60/1e6)
		expect(largeResult.totalCost).toBeCloseTo(7.8); // 1.8 + 6.0
	});
});
