/**
 * @module unit_testing
 */

/**
 * Namespace for unit testing.
 * @namespace
 * @alias unit_test
 * @author Tac Mortensen
 */
export const unit_test = {};

/**
 * A single test, typically collected with other tests to perform a unit test.
 * <br><br>
 * 
 * A predicate is passed to the constructor, and the test is run with supplied arguments via run method.
 * 
 * @param {function} predicate A function that takes arguments and either returns true or false.
 * @throws TypeError if {@link predicate} is not a function.
 * 
 * @class
 * @alias unit_test.test
 * @memberof unit_testing
 */
unit_test.test = class test
{
	/**
	 * @private
	 * @type boolean
	 */
	#has_been_run;

	/**
	 * @private
	 * @type boolean
	 */
	#passed;

	/**
	 * @private
	 * @type function
	 */
	#predicate;

	/** @public */
	constructor(predicate)
	{
		if(typeof(predicate) !== "function")
		{
			throw new TypeError(`In unit_test.test constructor, predicate must be a function. What was supplied: ${typeof predicate} ${predicate}`);
		}

		// No mishaps, so assign
		this.#predicate = predicate;
		this.#has_been_run = false;
	}

	/**
	 * Runs the {@link unit_test.test test} with the specified arguments.
	 * 
	 * @public
	 * @memberof unit_test.test
	 * 
	 * @param {boolean} benchmark Whether to benchmark how long the {@link unit_test.test test} takes to run.
	 * @param  {...any} args The arguments to supply the {@link unit_test.test test}.
	 * 
	 * @returns {number | void} How many milliseconds it took to run the {@link unit_test.test test} if {@link benchmark} is true,
	 * otherwise nothing.
	 * 
	 * @throws TypeError if underlying predicate did not return a boolean value.
	 */
	run(benchmark, ...args)
	{
		/** @type boolean */
		let passed;

		if(benchmark)
		{
			// Get current time in milliseconds
			/** @type number */
			const start = performance.now();

			// Run test
			passed = this.#predicate(...args);

			// Get current time again in milliseconds
			/** @type number */
			const end = performance.now();

			if(typeof(passed) !== "boolean")
			{
				throw new TypeError(`Predicate did not return a boolean value. What was returned: ${passed}`);
			}

			this.#passed = passed;

			// Signal that this test has been run
			this.#has_been_run = true;

			// Get how long in milliseconds it took to run test
			return end - start;
		}

		// Run test
		passed = this.#predicate(...args);

		if(typeof(passed) !== "boolean")
		{
			throw new TypeError(`Predicate did not return a boolean value. What was returned: ${passed}`);
		}

		this.#passed = passed;

		// Signal that this test has been run
		this.#has_been_run = true;
	}

	/**
	 * Whether {@link unit_test.test test} has yet been {@link run}.
	 * 
	 * @public
	 * @memberof unit_test.test
	 * @type boolean
	 */
	get has_been_run()
	{
		return this.#has_been_run;
	}

	/**
	 * Whether {@link unit_test.test test} passed when {@link run} was executed.
	 * 
	 * @public
	 * @memberof unit_test.test
	 * @type boolean
	 */
	get passed()
	{
		return this.#passed;
	}
};