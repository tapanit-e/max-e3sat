let fs = require('fs');
let sat = require('./sat.js');
let test1 = require('./w-approxi.js');
let test2 = require('./r-approxi.js');
let commandLineArgs = require('command-line-args');
let commandLineUsage = require('command-line-usage');

let Parser = function() {

	const defs = [
	
		{ name: 'ignore-weights', alias: 'w', type: Boolean, defaultValue: false },
		{ name: 'src', type: String, multiple: true, alias: 's' },
		{ name: 'alpha', type: Number, alias: 'a', defaultValue: 0.95 },
		{ name: 'gamma', type: Number, alias: 'g', defaultValue: 1000.0 },
		{ name: 'timeout', type: Number, alias: 't', defaultValue: 30 },
		{ name: 'runs', type: Number, alias: 'r', defaultValue: 1 }

	];
	let printHelp = false;
	let options = null;

	try {

		options = commandLineArgs(defs);

	} catch (e) {

		printHelp = true;

	}

	let args, a, d, s, iw, r;

	if (options && options.src) {	

		args = options.src;

		a = options.alpha;
		d = options.gamma;
		s = options.timeout;
		iw = options['ignore-weights'];
		r = options.runs;

	} else {

		const sections = [
  		
			{
    				header: 'Perceptron to approximate MAX E3SAT.',
    				content: 'Approximates MAX E3SAT in guaranteed 7/8 ratio'
  			},
  			{
    				header: 'Options',
    				optionList: [
      					{
        					name: 'src',
        					typeLabel: 'file',
        					description: 'Dimacs file(s)'
      					},
      					{
        					name: 'help',
						typeLabel: 'string',
        					description: 'Print this usage guide.'
      					},
					{
						name: 'ignore-weights',
						typeLabel: 'boolean',
						description: 'Ignores the first character in a clause as weight.'

					},
					{
						name: 'alpha',
						typeLabel: 'number',
						description: 'Learning rate for perceptron'

					},
					{
						name: 'gamma',
						typeLabel: 'number',
						description: 'How greedy the perecptron is for already satisfied clauses'

					},
					{
						name: 'timeout',
						typeLabel: 'number',
						description: 'Timeout in seconds'

					},
					{
						name: 'runs',
						typeLabel: 'number',
						description: 'How many times the instances will be tried'
				
					}
    				]
  			}
		];

		const usage = commandLineUsage(sections)
		console.log(usage);

		return;

	}

	while (r--)
	for (let arg = 0; arg < args.length; arg++) {

		let path = args[arg];
		let clauses = [];
		let data = fs.readFileSync(path, 'utf8');		

		console.log(path);
		
		data = data.split(' 0');

		for (let i = 0; i < data.length; i++) {

			let clause = [];
		
			if (data[i].indexOf('c') !== -1)
				continue;

			if (data[i].indexOf('p') !== -1)
				continue;

			if (data[i].trim() === '')
				continue;

			if (data[i].trim() === '%')
				continue;

			if (parseInt(data[i].trim()) === 0)
				continue;

			let temp = data[i].split(' ');

			if (iw)
				temp.shift();

			for (let j = 0; j < temp.length; j++)
				clause.push(parseInt(temp[j].replace(/(\r\n\t|\n|\r\t)/gm, "")));

			clauses.push(clause);
		}	

		if (isNaN(clauses[clauses.length - 1][0]))
			clauses.pop();

		console.log('No clauses ' + clauses.length);

		let set = {};

		for (let i = 0; i < clauses.length; i++)
			for (let j = 0; j < clauses[i].length; j++)
				set[clauses[i][j]] = true;

		console.log('No literals ' + Object.keys(set).length);

		let startTime = new Date().getTime();

		let copy = JSON.parse(JSON.stringify(clauses));

		if (clauses.length <= 500)
			new test1(clauses);
		
		new sat(copy, a, d, s);
		new test2(copy);
		
		let endTime = new Date().getTime();
		let total = endTime - startTime;

		console.log('Time taken ' + total);

	}

};

module.exports = Parser;
