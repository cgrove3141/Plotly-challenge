
function buildPlot() {

	d3.json("samples.json").then((data) => {
		console.log(data)
	});
}

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}


d3.json("samples.json").then((data) => {
	idSelect = d3.select("#selDataset")
	var names = data.names
	names.forEach((name) => {
    	var option = idSelect.append("option");
    	option.text(name);
	})
})

//d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged() {
	d3.json("samples.json").then((data) => {
		console.log(data)

		var dropdownMenu = d3.select("#selDataset");
		var idnum = dropdownMenu.property("value");
		console.log(idnum)

		var samples = data.samples.filter(function(sample) {
			return sample.id === idnum.toString()
		})[0]
		console.log(samples)


		var topten = samples.sample_values.slice(0,10).reverse()
		console.log(topten)

		var OTUs = samples.otu_ids.slice(0,10).reverse()
		var otustring = []
		OTUs.forEach(otu =>{
			strings = otu.toString()
			otustring.push(strings)
		})
		console.log(otustring)

		var otulabels = samples.otu_labels.slice(0,10).reverse()
		console.log(otulabels)

		var names = data.names
		console.log(names)
//demographics list
		var demographics = data.metadata.filter(function(person){
			return person.id == idnum
		})
		console.log(demographics)
		var gender = demographics[0].gender
		var ethnic = demographics[0].ethnicity
		var age = demographics[0].age
		var location = demographics[0].location

		buildTable(ethnic, gender, age, location)
//bar plot
		var data = [{
		  type: 'bar',
		  x: topten,
		  y: otustring,
		  text: otulabels,
		  orientation: 'h'
		}];

		var layout = {
		  title: 'Top 10 Sample Results',
		  xaxis:{
		  	title: 'Sample Result'
		  },
		  yaxis:{
		  	type:'category',
		  	title: 'OTU ID'
		  }
		};		

		Plotly.newPlot("bar", data, layout)
//bubble plot
		var allsamples = samples.sample_values
		console.log(topten)

		var OTUs2 = samples.otu_ids
		console.log(OTUs2)

		var otulabels2 = samples.otu_labels
		console.log(otulabels)		

		var markersize = []
		allsamples.forEach(sample =>{
			smaller = sample/2
			markersize.push(smaller)
		})

		console.log(markersize)

		var data2 = [{
		  x: OTUs2,
		  y: allsamples,
		  mode: 'markers',
		  marker:{
		  	size: markersize,
		  	color: OTUs2,
		  	colorscale: 'Reds'
		  },
		  text: otulabels2
		}];	

		var layout2 = {
		  title: 'Sample Results',
		  xaxis:{
		  	title: 'OTU ID',	  	
		  },
		  yaxis:{
		  	title: 'Sample Results'
		  }

		};	
		Plotly.newPlot("bubble", data2, layout2)
//Guage plot, I don't know where I'm supposed to be getting any of the data for washes from so I used a random number generator
		var data3 = [
		  {
		    domain: { x: [0, 1], y: [0, 1] },
		    value: Math.floor(Math.random() * 10) + 1,
		    title: { text: "Washes" },
		    type: "indicator",
		    mode: "gauge+number+delta",
		    gauge: {
		      axis: { range: [null, 10] },
		      steps: [
		        { range: [0, 5], color: "lightgray" },
		        { range: [5, 10], color: "gray" }
		      ],
		    }
		  }
		];
		var layout3 = { width: 600, height: 450, margin: { t: 0, b: 0 } };
		Plotly.newPlot('gauge', data3, layout3);				
	});

}

function buildTable(ethnicity, gender, age, location) {
  var table = d3.select("#sample-metadata");
  table.html("")
  table.append("li").text(`Gender: ${gender}`)
  table.append("li").text(`Ethnicity: ${ethnicity}`)
  table.append("li").text(`Age: ${age}`)
  table.append("li").text(`Location: ${location}`)
}



