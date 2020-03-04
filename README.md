# Perceptron MAX E3SAT

Approximation algorithm for MAX E3SAT

## Perceptron

The used perceptron calculates OR-function within the output node and updates weights for the input E3SAT clauses.

Contains also 7/8 approximation algorithms for MAX E3SAT for benchmark testing.

__outperforms__ with high probability the SOTA approximation algorithms for MAX E3SAT...

### Installation

```
$npm i fs
$npm i command-line-args
$npm i command-line-usage
```
### Use

```
$node main.js [-w] --src path/to/dimacs1 [--src path/to/dimacs2...] --alpha ]0, x] --gamma ]0, y] --timeout seconds --runs [1, z]
```

## Authors

* **Tapani Toivonen @UEF school of computing** - *Initial work* - [web](http://tapanit.me/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
