function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // b3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // b4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(Obj => Obj.id == sample);
    // g1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeData = data.metadata.filter(Obj => Obj.id==sample);
    //  b5. Create a variable that holds the first sample in the array.
    var samplesResult = filteredSamples[0];
    // g2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeData[0];
    // b6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = samplesResult.otu_ids;
    var otu_labels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;
    // g3. Create a variable that holds the washing frequency.
    var wfreqResult = gaugeResult.wfreq
    // b7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(otu_ID => `OTU ${otu_ID}`).reverse();

    // b8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      title: {text:"<b>Top 10 Bacteria Cultures Found</b>"},
      text: otu_labels.slice(0,10).reverse(),
      type:"bar",
      orientation: "h"
    }];
    // b9. Create the layout for the bar chart. 
    var barLayout = {
     
     margin: {
      t: 100,
      b: 30,
      l: 100,
      r: 100
     }
    };
    // b10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

     // 1. Create the trace for the bubble chart.
     var bubbleData = [{
      x: samplesResult.otu_ids,
      y: samplesResult.sample_values,
      text: samplesResult.otu_labels,
      mode:"markers",
      marker:{
        size: samplesResult.sample_values, 
        color: samplesResult.sample_values,
        colorscale: "Portland"
      }
     }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {text: "<b>Bacteria Cultures Per Sample</b>"},
      xaxis:{title:"OTU ID"},
      automagin: true,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreqResult,
      type: "indicator",
      mode: "gauge+number",
      title: {text:"<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font:{size: 18}},
      gauge: {
        axis: { range: [null, 10], tickwidth: 1},  
        bar: { color: "dimgray" },
        bgcolor: "white",
        borderwidth: 2,  
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "firebrick" },
          { range: [2, 4], color: "lightcoral" },
          { range: [4, 6], color: "orange"},
          { range: [6, 8], color: "yellowgreen"},
          { range: [8, 10], color: "forestgreen"}
  
        ],
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600,
      height: 600
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
