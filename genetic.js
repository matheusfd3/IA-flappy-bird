class Genetic {
  constructor(inputs, outputs) {
    this.createGenomes(inputs, outputs);
  }

  createGenomes(inputs, outputs) {
    const pool = 10, connections = 15, gates = 5;
    while(genomes.length < totalBirds) {
      let genome = new Architect.Liquid(inputs, pool, outputs, connections, gates);
      genome.fitness = 0;
      genomes.push(genome);
    }
  }

  activateNetwork(network, input) {

    if (input == undefined) {
      network.fitness = 0;
      input = [0, 0];
    }

    return network.activate(input);
  }

  prepareCrossover() {

    genomes = this.selectBestGenomes(2);

    var bestGenomes = _.clone(genomes);

    // crossover de apenas 1/4
    while (genomes.length < (totalBirds - Math.round(totalBirds / 2))) {
        var genA = _.sample(bestGenomes).toJSON();
        var genB = _.sample(bestGenomes).toJSON();

        // Cross over and Mutate
        var newGenome = this.mutate(this.crossOver(genA, genB));

        genomes.push(Network.fromJSON(newGenome));
    }

    while (genomes.length < totalBirds) {
        // Get two random Genomes
        var gen = _.sample(bestGenomes).toJSON();

        // Mutate
        var newGenome = this.mutate(gen);

        // Add to generation
        genomes.push(Network.fromJSON(newGenome));
    }
  }

  selectBestGenomes(selectN) {

    var selected = _.sortBy(genomes, 'fitness').reverse();

    while (selected.length > selectN) {
        selected.pop();
    }

    return selected;
  }

  crossOver(netA, netB) {
    // Swap (50% prob.)
    if (Math.random() > 0.5) {
        var tmp = netA;
        netA = netB;
        netB = tmp;
    }

    // Clone network
    netA = _.cloneDeep(netA);
    netB = _.cloneDeep(netB);

    // Cross over data keys
    this.crossOverDataKey(netA.neurons, netB.neurons, 'bias');

    return netA;
  }

  crossOverDataKey(a, b, key) {
    var cutLocation = Math.round(a.length * Math.random());

    var tmp;
    for (var k = cutLocation; k < a.length; k++) {
        // Swap
        tmp = a[k][key];
        a[k][key] = b[k][key];
        b[k][key] = tmp;
    }
  }

  mutate(net) {

    this.mutateDataKeys(net.neurons, 'bias', 0.3);

    this.mutateDataKeys(net.connections, 'weight', 0.3);

    return net;
  }

  mutateDataKeys(a, key, mutationRate) {
    for (var k = 0; k < a.length; k++) {

      if (Math.random() > mutationRate) {
          continue;
      }

      a[k][key] += a[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
    }
  }

  executeGenome(pos, co) {
    if (genomes[pos].fitness == undefined || genomes[pos].fitness < score) {
      genomes[pos].fitness = score;
    }

    if (score > bestScore) {
      bestScore = score;
    }

    if (co) {
      this.prepareCrossover();
      generation++;
    }
  }
}