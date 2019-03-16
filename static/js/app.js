function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  metadataURL = `/metadata/${sample}`;
  d3.json(metadataURL).then(function(metadata) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataTable = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataTable.html("");

    var tbody = metadataTable.append("tbody");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(metadata).forEach((variable) => {
      var row = tbody.append("tr");
      row.text(`${variable[0]}: ${variable[1]}`);
    });
  })
}


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // plotDataUrl = '/samples/940';
  plotDataUrl = `/samples/${sample}`;
  d3.json(plotDataUrl).then(function(sampleData) {

    // @TODO: Build a Bubble Chart using the sample data
    // https://plot.ly/javascript/bubble-charts/
    var bubbleTrace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids
      }
    };

    var bubbleData = [bubbleTrace];

    Plotly.newPlot('bubble', bubbleData);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    // sort sample values
    sampleData.sample_values.sort(function(a, b) {
      return parseFloat(b) - parseFloat(a)
    })

    var pieTrace = {
      type: "pie",
      labels: sampleData.otu_ids.slice(0, 10),
      values: sampleData.sample_values.slice(0, 10)
    };
    
    var pieData = [pieTrace];
    
    Plotly.newPlot("pie", pieData);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();