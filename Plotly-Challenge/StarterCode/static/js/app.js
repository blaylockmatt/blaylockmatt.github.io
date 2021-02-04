function init() {
    let selector = d3.select('#selDataset')
    d3.json('../data/samples.json').then((data) => {
        let sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
            .append('option')
            .text(sample)
            .property('value', sample);
        });
        
        let firstSample = sampleNames[0]
        fillMetadata(firstSample);  
        buildPlots(firstSample);
    });

}

function fillMetadata(sample) {
    d3.json('../data/samples.json').then((data) => {
        let metadata = data.metadata;
        let filterArray = metadata.filter(item => item.id == sample);
        let result = filterArray[0];
        console.log(result);
        let panel = d3.select('#sample-metadata');
        panel.html("");
        Object.entries(result).forEach(([key,value]) => {
            panel.append('p').text(`${key}:${value}`)
        })
})
}

function buildPlots(sample) {
    d3.json("../data/samples.json").then((data) => {
        
        let samples = data.samples
        let filteredArray = samples.filter(item => item.id == sample);
        let result_2 = filteredArray[0];

        let sample_values = result_2.sample_values;
        let otu_ids = result_2.otu_ids;
        let otu_labels = result_2.otu_labels;

        var barData = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(item => `OTU ${item}`).reverse() ,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
          }];
          
          
          // Apply the group bar mode to the layout
          var layout = {
            title: "Top 10 Bacteria Found",
            margin: {
              l: 100,
              r: 100,
              t: 100,
              b: 100
            }
          };
          
          // Render the plot to the div tag with id "plot"
          Plotly.newPlot("bar", barData, layout);
       
          // Build a Bubble Chart
        let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      var bubbleData = [
        {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
            size: sample_values,
            color: otu_ids,
          }
        }
      ];
  
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
        })
    
      

}

function optionChanged(newSample) {

    buildPlots(newSample)
    fillMetadata(newSample)

}
init();
