let keyframeIndex = 0;

let keyframes = [
  {
    activeVerse: 1,
    activeLines: [1, 2, 3, 4],
    // add svgUpdate fields to keyframes
    svgUpdate: drawSatisfication,
  },
  {
    activeVerse: 2,
    activeLines: [1, 2, 3, 4],
    svgUpdate: redrawSatisfication,
  },
  {
    activeVerse: 3,
    activeLines: [1, 2, 3, 4],
    svgUpdate: drawHousehold,
  },
  {
    activeVerse: 4,
    activeLines: [1, 2],
    svgUpdate: drawOutlook,
  },
];

document
  .getElementById("forward-button")
  .addEventListener("click", forwardClicked);
document
  .getElementById("backward-button")
  .addEventListener("click", backwardClicked);

function forwardClicked() {
  if (keyframeIndex < keyframes.length - 1) {
    keyframeIndex++;
    drawKeyframe(keyframeIndex);
  }
}

function backwardClicked() {
  if (keyframeIndex > 0) {
    keyframeIndex--;
    drawKeyframe(keyframeIndex);
  }
}

function drawKeyframe(kfi) {
  let kf = keyframes[kfi];
  resetActiveLines();
  updateActiveVerse(kf.activeVerse);
  for (line of kf.activeLines) {
    updateActiveLine(kf.activeVerse, line);
  }
  if (kf.svgUpdate) {
    kf.svgUpdate();
  }
}

function resetActiveLines() {
  d3.selectAll(".line").classed("active-line", false);
}

function updateActiveVerse(id) {
  d3.selectAll(".verse").classed("active-verse", false);
  d3.select(`#verse-${id}`).classed("active-verse", true);
  scrollLeftColumnToActiveVerse(id);
}

function updateActiveLine(vid, lid) {
  let thisVerse = d3.select("#verse" + vid);
  thisVerse.select("#line" + lid).classed("active-line", true);
}

function scrollLeftColumnToActiveVerse(id) {
  var leftColumn = document.querySelector(".left-column-content");
  var activeVerse = document.getElementById("verse" + id);
  var verseRect = activeVerse.getBoundingClientRect();
  var leftColumnRect = leftColumn.getBoundingClientRect();
  var desiredScrollTop =
    verseRect.top +
    leftColumn.scrollTop -
    leftColumnRect.top -
    (leftColumnRect.height - verseRect.height) / 2;
  leftColumn.scrollTo({
    top: desiredScrollTop,
    behavior: "smooth",
  });
}

let isScrolling = false;
window.addEventListener("wheel", function (e) {
  if (!isScrolling) {
    // console.log(e.deltaY)
    if (e.deltaY > 0) {
      isScrolling = true;
      forwardClicked();
      setTimeout(function () {
        isScrolling = false;
      }, 800); // Set a delay before allowing another scroll event
    } else if (e.deltaY < 0) {
      isScrolling = true;
      backwardClicked();
      setTimeout(function () {
        isScrolling = false;
      }, 800); // Set a delay before allowing another scroll event
    }
  }
});

// set the dimensions and margins of the graph
let margin = { top: 100, right: 100, bottom: 100, left: 100 },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3
  .select("#svg")
  .append("svg")
  .attr("width", 1000)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// color palette = one color per subgroup
let color = d3.scaleOrdinal().range(["LightCoral", "LightBlue"]);

function drawSatisfication() {
  // Parse the Data
  d3.csv("../data/final_satisfaction_4point.csv", function (data) {
    var subgroups = data.columns.slice(1);
    var groups = d3
      .map(data, function (d) {
        return d.age;
      })
      .keys();
    var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0));
    var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    var xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);
    svg
      .append("g")
      .selectAll("g")
      // Enter in data by looping group
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.age) + ",0)";
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xSubgroup(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", function (d) {
        return color(d.key);
      });
    svg
      .append("text")
      .attr("id", "chart-title")
      .attr("x", -5)
      .attr("y", -10)
      .text("Change in self-satisfication through adolescence by gender");

    svg
      .append("text")
      .attr("id", "axis-label")
      .attr("text-anchor", "end")
      .attr("x", width / 2)
      .attr("y", height + 30)
      .text("Age");
    svg
      .append("text")
      .attr("id", "axis-label")
      .attr("text-anchor", "end")
      .attr("y", -40)
      .attr("transform", "rotate(-90)")
      .text("%Participants satisfying with themselves");
    svg
      .append("text")
      .attr("id", "caption")
      .attr("text-anchor", "end")
      .attr("x", width / 2)
      .attr("y", height + 90)
      .text("Source: Millennium Cohort Study (MCS)");
  });
}

function drawHousehold() {
  svg.selectAll("*").remove();
  d3.json("../data/household_china.json", function (data) {
    console.log(data);
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let radius = Math.min(chartWidth, chartHeight) / 2;

    var pie = d3.pie().value((d) => d.count);
    var path = d3.arc().innerRadius(0).outerRadius(radius);

    const pies = chart
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");
    pies
      .append("path")
      .attr("class", "path")
      .attr("d", path)
      .attr("fill", "MediumSeaGreen");

    svg.selectAll(".path").transition().duration(1000);
    svg
      .selectAll(".path")
      .transition()
      .duration(1000)
      // update it's fill colour
      .attr("fill", function (d, i) {
        return color(i);
      });

    svg
      .append("text")
      .attr("id", "chart-title")
      .attr("x", -5)
      .attr("y", -10)
      .text("Average time spent on routine housework in China by gender");

    svg
      .append("text")
      .attr("id", "caption")
      .attr("text-anchor", "end")
      .attr("x", width / 2+150)
      .attr("y", height + 90)
      .text("Source: Organisation for Economic Co-operation and Development (OECD)");
  });
}

function drawOutlook() {
  svg.selectAll("*").remove();
  d3.csv("../data/futureExpect.csv", function (data) {
    var subgroups = data.columns.slice(1);
    var groups = d3
      .map(data, function (d) {
        return d.outlook;
      })
      .keys();
    var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(0));
    var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));
    var xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);
    svg
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.outlook) + ",0)";
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xSubgroup(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return height - y(d.value);
      })
      .attr("fill", "black");

    svg
    .append("text")
    .attr("id", "chart-title")
    .attr("x", 70)
    .attr("y", -10)
    .text("Outlooks of Future at Age 17");

  svg
    .append("text")
    .attr("id", "axis-label")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + 30)
    .text("Achievement");
  svg
    .append("text")
    .attr("id", "axis-label")
    .attr("text-anchor", "end")
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("%Participants answering Yes or No");
  svg
    .append("text")
    .attr("id", "caption")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height + 90)
    .text("Source: Millennium Cohort Study (MCS)");
  });
  colorOutlook();
}

function colorOutlook() {
  document.addEventListener("click", (event) => {
    let checkboxes = document.querySelectorAll('input[name="outlook"]:checked');
    checkboxes.forEach((checkbox) => {
      console.log(checkbox.value);
    });
  });
}

function redrawSatisfication() {
  svg.selectAll("*").remove();
  drawSatisfication();
}

drawKeyframe(keyframeIndex);
