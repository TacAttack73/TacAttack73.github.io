// imports
import {root_finders, numerical_util} from "./numerical_methods.js";



// client-defined constants
/** @type {Map<string, string>} */
const function_constants = new Map();



// algorithm layer count
/** @type {number} */
let layer_count = 1;



// buttons
/** @type {HTMLButtonElement} */
const add_constant_button = document.getElementById("root_finder_calculator_add_constant");

/** @type {HTMLButtonElement} */
const remove_constant_button = document.getElementById("root_finder_calculator_remove_constant");

/** @type {HTMLButtonElement} */
const add_layer_button = document.getElementById("root_finder_calculator_add_layer");

/** @type {HTMLButtonElement} */
const remove_layer_button = document.getElementById("root_finder_calculator_remove_layer");

/** @type {HTMLButtonElement} */
const add_derivative_button = document.getElementById("root_finder_calculator_add_derivative");

/** @type {HTMLButtonElement} */
const remove_derivative_button = document.getElementById("root_finder_calculator_remove_derivative");

/** @type {HTMLButtonElement} */
const add_second_derivative_button = document.getElementById("root_finder_calculator_add_second_derivative");

/** @type {HTMLButtonElement} */
const remove_second_derivative_button = document.getElementById("root_finder_calculator_remove_second_derivative");

/** @type {HTMLButtonElement} */
const run_button = document.getElementById("root_finder_calculator_run");



// text input containers
/** @type {HTMLTextAreaElement} */
const function_area = document.getElementById("root_finder_calculator_function_box");

/** @type {HTMLTextAreaElement} */
const derivative_area = document.getElementById("root_finder_calculator_derivative_box");

/** @type {HTMLTextAreaElement} */
const second_derivative_area = document.getElementById("root_finder_calculator_second_derivative_box");

/** @type {HTMLInputElement} */
const constant_name_input = document.getElementById("root_finder_calculator_constant_name");

/** @type {HTMLInputElement} */
const constant_value_input = document.getElementById("root_finder_calculator_constant_value");

/** @type {HTMLInputElement} */
const guess_input = document.getElementById("root_finder_calculator_layer_1_guess_1");

/** @type {HTMLInputElement} */
const second_guess_input = document.getElementById("root_finder_calculator_layer_1_guess_2");



// selector containers
/** @type {HTMLSelectElement} */
const constant_selector = document.getElementById("root_finder_calculator_constant_keys");

/** @type {HTMLSelectElement} */
const first_method_selector = document.getElementById("root_finder_calculator_layer_1_method");



// label elements
/** @type {HTMLLabelElement} */
const derivative_label = document.getElementById("root_finder_calculator_derivative_label");

/** @type {HTMLLabelElement} */
const second_derivative_label = document.getElementById("root_finder_calculator_second_derivative_label");

/** @type {HTMLLabelElement} */
const second_guess_label = document.getElementById("root_finder_calculator_layer_1_guess_2_label");



// div element
/** @type {HTMLDivElement} */
const result_container = document.getElementById("root_finder_calculator_result_section");



// body element of document
/** @type {HTMLBodyElement} */
const body_element = document.getElementsByTagName("body")[0];



/**
 * Add option to constant selector.
 *
 * @ignore
 *
 * @param {string} constant_name Name of constant.
 * @param {string} constant_value Value of constant.
 */
function add_selector_option(constant_name, constant_value)
{
  // if constant already exists, update it, don't add a new option
  if(function_constants.has(constant_name))
  {
    // get option to update
    /** @type {HTMLOptionElement} */
    const option_to_update = document.getElementById(`root_finder_calculator_constants_${constant_name}`);

    // reset corresponding option's text
    option_to_update.innerHTML = `${constant_name}: ${constant_value}`;

    // exit function
    return;
  }

  // create new option
  /** @type {HTMLOptionElement} */
  const new_option = document.createElement("option");

  // set option's value & text to constant_name
  new_option.value = constant_name;
  new_option.innerHTML = `${constant_name}: ${constant_value}`;

  // set option's id to a unique value
  new_option.id = `root_finder_calculator_constants_${constant_name}`;

  // add option to selector
  constant_selector.options.add(new_option);
}


/**
 * Remove option from constant selector.
 *
 * @ignore
 *
 * @param {string} constant_name Name of constant.
 */
function remove_selector_option(constant_name)
{
  // get option to remove
  /** @type {HTMLOptionElement} */
  const option_to_remove = document.getElementById(`root_finder_calculator_constants_${constant_name}`);

  // remove option
  option_to_remove.remove();
}



// add event listener to first method selector
first_method_selector.addEventListener("change", (event) =>
{
  // get selected method
  /** @type {string} */
  const choice = first_method_selector.options[first_method_selector.selectedIndex].value;

  // if variation of Newton's method, hide second guess elements
  if(choice === "newtons_method" || choice === "modified_newtons_method")
  {
    // hide second guess label & input if not hidden
    if(!second_guess_input.classList.contains("hidden"))
    {
      // hide elements
      second_guess_input.classList.add("hidden");
      second_guess_label.classList.add("hidden");
    }
  }

  // if not variation of Newton's method, unhide second guess elements
  else
  {
    // unhide second guess label & input if hidden
    if(second_guess_input.classList.contains("hidden"))
    {
      // unhide elements
      second_guess_label.classList.remove("hidden");
      second_guess_input.classList.remove("hidden");
    }
  }
});



// add event listener to add_constant_button
add_constant_button.addEventListener("click", () =>
{
  // get constant name from input
  /** @type {string} */
  const constant_name = constant_name_input.value.trim();

  // abort if variable name is x
  if(constant_name === "x")
  {
    // notify user that x is reserved for variable name
    alert("x must be reserved for the variable of the function.");

    // exit function
    return;
  }

  // abort if variable name is blank
  if(constant_name === "")
  {
    // notify user that constant must be named
    alert("Constant cannot have a blank name.");

    // exit function
    return;
  }

  // get constant value from input
  /** @type {string} */
  const constant_value = constant_value_input.value.trim();

  // abort if constant's value is blank
  if(constant_value === "")
  {
    // notify user that constant must have a value
    alert("Constant's value cannot be blank.");

    // exit function
    return;
  }

  // Add selector option
  add_selector_option(constant_name, constant_value);

  // update constant map
  function_constants.set(constant_name, constant_value);

  // display selector & remove button
  constant_selector.classList.remove("hidden");
  remove_constant_button.classList.remove("hidden");
});



// add event listener to remove_constant_button
remove_constant_button.addEventListener("click", () =>
{
  // get selected option
  /** @type {HTMLOptionElement} */
  const selected_option = constant_selector.options[constant_selector.selectedIndex];

  // delete constant from constant map
  function_constants.delete(selected_option.value);

  // remove option from selector
  remove_selector_option(selected_option.value);

  // hide selector & remove button if no constants exist
  if(function_constants.size === 0)
  {
    constant_selector.classList.add("hidden");
    remove_constant_button.classList.add("hidden");
  }
});



// add event listener to add_layer_button
add_layer_button.addEventListener("click", () =>
{
  // increment layer_count first
  ++layer_count;

  // create new div element
  /** @type {HTMLDivElement} */
  const new_layer = document.createElement("div");

  // set div element's class to layer as defined in CSS file
  new_layer.className = "layer";

  // assign id to div element based on layer count
  new_layer.id = `root_finder_calculator_layer_${layer_count}_section`;

  // get method selector
  /** @type {HTMLSelectElement} */
  const method_selector = document.getElementById("root_finder_calculator_layer_1_method");

  // create new method selector
  /** @type {HTMLSelectElement} */
  const method_selector_clone = document.createElement("select");

  // set clone's class as defined in CSS file
  method_selector_clone.className = "default_text_container";

  // copy over all options
  for(const option of method_selector.options)
  {
    // create new option
    /** @type {HTMLOptionElement} */
    const option_clone = document.createElement("option");

    // copy option text content
    option_clone.textContent = option.textContent;

    // copy option value
    option_clone.value = option.value;

    // append option clone
    method_selector_clone.options.add(option_clone);
  }

  // reassign clone's id
  method_selector_clone.id = `root_finder_calculator_layer_${layer_count}_method`;

  // create new label element for method selector
  /** @type {HTMLLabelElement} */
  const method_selector_label = document.createElement("label");

  // assign label to method selector
  method_selector_label.htmlFor = `root_finder_calculator_layer_${layer_count}_method`;

  // set method selector label text
  method_selector_label.textContent = `Root-finder: `;

  // create error tolerance input
  /** @type {HTMLInputElement} */
  const error_tolerance_input = document.createElement("input");

  // set error tolerance input's class as defined in CSS file
  error_tolerance_input.className = "default_text_container";

  // set error tolerance input's type to text
  error_tolerance_input.type = "text";

  // set error tolerance input's id
  error_tolerance_input.id = `root_finder_calculator_layer_${layer_count}_error_tolerance`;

  // create new label element for error tolerance input
  /** @type {HTMLLabelElement} */
  const error_tolerance_label = document.createElement("label");

  // assign label to error tolerance input
  error_tolerance_label.htmlFor = `root_finder_calculator_layer_${layer_count}_error_tolerance`;

  // set error tolerance label text
  error_tolerance_label.textContent = ` Error tolerance: `;

  // create max iteration count input
  /** @type {HTMLInputElement} */
  const max_iteration_input = document.createElement("input");

  // set max iteration input's class as defined in CSS file
  max_iteration_input.className = "default_text_container";

  // set max iteration input's type to number
  max_iteration_input.type = "number";

  // set max iteration input's id
  max_iteration_input.id = `root_finder_calculator_layer_${layer_count}_max_iterations`;

  // create new label element for max iteration input
  /** @type {HTMLLabelElement} */
  const max_iteration_label = document.createElement("label");

  // assign label to max iteration input
  max_iteration_label.htmlFor = `root_finder_calculator_layer_${layer_count}_max_iterations`;

  // set max iteration label text
  max_iteration_label.textContent = ` Max allowed iterations: `;

  // unhide remove layer button if it is hidden
  remove_layer_button.classList.remove("hidden");

  // add children to new layer
  new_layer.append(
    method_selector_label,
    method_selector_clone,
    error_tolerance_label,
    error_tolerance_input,
    max_iteration_label,
    max_iteration_input);

  // add new layer to body before result div element
  body_element.insertBefore(new_layer, result_container);
});



// add event listener to remove_layer_button
remove_layer_button.addEventListener("click", () =>
{
  // get bottom layer
  /** @type {HTMLDivElement} */
  const bottom_layer = document.getElementById(`root_finder_calculator_layer_${layer_count}_section`);

  // decrement layer count
  --layer_count;

  // hide this button if only one layer remains
  if(layer_count === 1)
    remove_layer_button.classList.add("hidden");

  // remove bottom layer
  body_element.removeChild(bottom_layer);
});



// add event listener to add_derivative_button
add_derivative_button.addEventListener("click", () =>
{
  // hide this button
  add_derivative_button.classList.add("hidden");

  // unhide multiple elements
  remove_derivative_button.classList.remove("hidden");
  derivative_label.classList.remove("hidden");
  derivative_area.classList.remove("hidden");
  add_second_derivative_button.classList.remove("hidden");
});



// add event listener to remove_derivative_button
remove_derivative_button.addEventListener("click", () =>
{
  // clear text
  derivative_area.value = "";

  // unhide add derivative button
  add_derivative_button.classList.remove("hidden");

  // hide multiple elements
  add_second_derivative_button.classList.add("hidden");
  derivative_area.classList.add("hidden");
  derivative_label.classList.add("hidden");
  remove_derivative_button.classList.add("hidden");
});



// add event listener to add_second_derivative button
add_second_derivative_button.addEventListener("click", () =>
{
  // hide this button
  add_second_derivative_button.classList.add("hidden");

  // unhide multiple elements
  remove_second_derivative_button.classList.remove("hidden");
  second_derivative_label.classList.remove("hidden");
  second_derivative_area.classList.remove("hidden");
});



/// add event listener to remove_second_derivative button
remove_second_derivative_button.addEventListener("click", () =>
{
  // clear text
  second_derivative_area.value = "";

  // unhide add second derivative button
  add_second_derivative_button.classList.remove("hidden");

  // unhide multiple elements
  second_derivative_area.classList.add("hidden");
  second_derivative_label.classList.add("hidden");
  remove_second_derivative_button.classList.add("hidden");
});



// add event listener to run_button
run_button.addEventListener("click", () =>
{
  // get user-input first guess
  /** @type {number} */
  const first_guess = parseFloat(guess_input.value);

  // abort process if guess is not a number
  if(isNaN(first_guess))
  {
    // notify user that guess must be a number
    alert("guess must be a number and supplied.");

    // exit function
    return;
  }

  // get other endpoint
  /** @type {number} */
  const second_guess = parseFloat(second_guess_input.value);

  // abort if second guess is needed and not appropriately given
  if(!second_guess_input.classList.contains("hidden") && isNaN(second_guess))
  {
    // notify user that second guess must be given as a number
    alert("For bisection & regula-falsi, other endpoint must be given as a number.");

    // exit function
    return;
  }

  // get user-input function text
  /** @type {string} */
  const function_text_input = function_area.value;

  // abort process if function text is empty
  if(function_text_input === "")
  {
    // notify user that function text cannot be blank
    alert("Must have text in function area to run algorithm.");

    // exit function
    return;
  }

  // get user-input derivative text
  /** @type {string} */
  const derivative_text_input = derivative_area.value;

  // get user-input second derivative text
  /** @type {string} */
  const second_derivative_text_input = second_derivative_area.value;

  // whether derivative text box is empty
  /** @type {boolean} */
  const derivative_not_used = derivative_text_input === "";

  // whether second derivative text box is hidden
  /** @type {boolean} */
  const second_derivative_not_used = second_derivative_text_input === "";

  // allocate array for error tolerances
  /** @type {Array<number>} */
  const error_tolerances = new Array(layer_count);

  // allocate array for max iteration counts
  /** @type {Array<number>} */
  const max_iteration_counts = new Array(layer_count);

  // allocate array for methods
  /** @type {Array<string>} */
  const consecutive_methods = new Array(layer_count);

  // loop incrementer
  /** @type {number} */
  let i;

  // fetch each layer's info
  for(i = 0; i < layer_count; i++)
  {
    // set next error tolerance to parsed value in next layer
    error_tolerances[i] = parseFloat(document.getElementById(`root_finder_calculator_layer_${i + 1}_error_tolerance`).value);

    // abort process & alert user if error tolerance not a number
    if(isNaN(error_tolerances[i]))
    {
      // notify user why process must abort
      alert(`Error tolerance must be a number and supplied in layer ${i + 1}.`);

      // exit function
      return;
    }

    // fetch user input in max iteration input
    /** @type {string} */
    const max_iteration_input_value = document.getElementById(`root_finder_calculator_layer_${i + 1}_max_iterations`).value;

    // set next max iteration count to 2^63 - 1 if input is blank, otherwise parsed value from input
    max_iteration_counts[i] = max_iteration_input_value === "" ? Number.MAX_SAFE_INTEGER : parseInt(max_iteration_input_value);

    // abort process & alert user if max iteration count is not a number
    if(isNaN(max_iteration_counts[i]))
    {
      // notify user why process must abort
      alert(`Max iteration count must be a number and supplied in layer ${i + 1}.`);

      // exit function
      return;
    }

    // set next method to value in next layer
    consecutive_methods[i] = document.getElementById(`root_finder_calculator_layer_${i + 1}_method`).value;

    // abort if method requiring derivative information not supplied is requested
    if(derivative_not_used && (consecutive_methods[i] === "newtons_method" || consecutive_methods[i] === "modified_newtons_method")
      || second_derivative_not_used && consecutive_methods[i] === "modified_newtons_method")
    {
      // notify user that derivative information is necessary
      alert(`${consecutive_methods[i] === "newtons_method" ? "" : "Modified "} Newton's method requires ${consecutive_methods[i] === "newtons_method" ? "" : "first and second"} derivative information.`);

      // exit function
      return;
    }
  }

  // allocate array for constant declarations in function
  /** @type {string} */
  let constant_declaration_lines = "";

  // set i to 0 for upcoming for-each loop
  i = 0;

  // construct each constant declaration line
  for(const [constant_name, constant_value] of function_constants)
    constant_declaration_lines = constant_declaration_lines.concat(`const ${constant_name} = ${constant_value};\n`);

  // create function
  /** @type {Function} */
  const f = new Function("x", constant_declaration_lines.concat(function_text_input));

  // create derivative
  /** @type {Function} */
  const df = derivative_text_input === "" ? null : new Function("x", constant_declaration_lines.concat(derivative_text_input));

  // create second derivative
  /** @type {Function} */
  const d2f = second_derivative_text_input === "" ? null : new Function("x", constant_declaration_lines.concat(second_derivative_text_input));

  // cache previous method used to check whether next layer can be executed
  /** @type {string} */
  let previous_method = "bisection";

  // declare intermediary result to calculate
  /** @type {numerical_util.numerical_results} */
  let intermediary_result = null;

  // get current time in millis
  /** @type {DOMHighResTimeStamp} */
  const start = performance.now();

  // run layered algorithm
  for(i = 0; i < layer_count; i++)
  {
    // hopefully, no exceptions are thrown due to bad user-input
    try
    {
      // execution depends on what root-finder user wants executed
      switch(consecutive_methods[i])
      {
        // user wants to use bisection
        case "bisection":
          // previous method must be bracketed
          if(previous_method !== "bisection" && previous_method !== "regula_falsi")
          {
            // notify uesr that previous method had to be bracketed
            alert(`Cannot perform bisection if previous method was not bracketed; previous method: ${previous_method}`);

            // exit function
            return;
          }

          // compute next intermediary result
          intermediary_result = root_finders.bisection_method(f,
            intermediary_result === null ? [first_guess, second_guess] : intermediary_result.result,
            new numerical_util.continuation_options(error_tolerances[i], max_iteration_counts[i]));

          // break from switch statement
          break;

        // user wants to use regula-falsi
        case "regula_falsi":
          // previous method must be bracketed
          if(previous_method !== "bisection" && previous_method !== "regula_falsi")
          {
            // notify uesr that previous method had to be bracketed
            alert(`Cannot perform regula-falsi if previous method was not bracketed; previous method: ${previous_method}`);

            // exit function
            return;
          }

          // compute next intermediary result
          intermediary_result = root_finders.regula_falsi(f,
            intermediary_result === null ? [first_guess, second_guess] : intermediary_result.result,
            new numerical_util.continuation_options(error_tolerances[i], max_iteration_counts[i]));

          // break from switch statement
          break;

        // user wants to use secant method
        case "secant_method":
          // previous method cannot be a variation of Newton's method
          if(previous_method === "newtons_method" || previous_method === "modified_newtons_method")
          {
            // alert user of restriction of previous method
            alert(`Secant method requires two guesses to operate, so previous method cannot be variation of Newton's method; previous method: ${previous_method}`);

            // exit function
            return;
          }

          // compute next intermediary result
          intermediary_result = root_finders.secant_method(f,
            intermediary_result === null ? [first_guess, second_guess] : intermediary_result.result,
            new numerical_util.continuation_options(error_tolerances[i], max_iteration_counts[i]));

          // break from switch statement
          break;

        // user wants to use Newton's method
        case "newtons_method":
          // compute next intermediary result
          intermediary_result = root_finders.newtons_method(f, df,
            intermediary_result === null ? first_guess :
              (typeof(intermediary_result.result) === "number" ? intermediary_result.result : 0.5 * (intermediary_result.result[0] + intermediary_result.result[1])),
            new numerical_util.continuation_options(error_tolerances[i], max_iteration_counts[i]));

          // break from switch statement
          break;

        // user wants to use modified Newton's method
        case "modified_newtons_method":
          // compute next intermediary result
          intermediary_result = root_finders.modified_newtons_method(f, df,
            intermediary_result === null ? first_guess :
              (typeof(intermediary_result.result) === "number" ? intermediary_result.result : 0.5 * (intermediary_result.result[0] + intermediary_result.result[1])),
            new numerical_util.continuation_options(error_tolerances[i], max_iteration_counts[i]),
            true, d2f);

          // break from switch statement
          break;
      }

      // reassign previous method
      previous_method = consecutive_methods[i];
    }

    // something likely went wrong w/ function calls
    catch(ex)
    {
      // show user stack trace
      alert(ex.stack);

      // exit function
      return;
    }
  }

  // get current time again
  /** @type {DOMHighResTimeStamp} */
  const now = performance.now();

  // get solution
  /** @type {number | Array<number>} */
  const x = previous_method === "secant_method" ? intermediary_result.result[1] : intermediary_result.result;

  result_container.textContent = `Solution: x ${typeof(x) === "number" ? "~ ".concat(String(x)) : "in [".concat(String(x)).concat("]")} (performance: ${now - start} ms)`;

  // unhide & alter result section if hidden
  if(result_container.classList.contains("hidden"))
  {
    // unhide result container
    result_container.classList.remove("hidden");
  }
});