function unpack(rows, key) {
  // Utility, unpack an array of lists to a single array
  return rows.map(function(row) {return row[key]; });
}

function subset(df, columns) {
  //Utility, select
}

function prettifyTable(df) {
  // Convenience function essentially for printing out my tables to QA
  strout = "<br />" + df.columns.join(", ") + "<br />";   // Column names
  df.map(function(row) {strout = strout + Object.values(row).join(", ") + "<br />"});  // Row values
  return strout;
}

function prettifyVariableName(string, sep="_") {
  // Takes an underscore_separated_variable_name and does some simple formatting,
  // to output 'Underscore Separated Variable Name'
  function capitaliseFirst(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1);
  }
  return string.split(sep).map(capitaliseFirst).join(" ");
}

function prettifyNumber(primitive, significance=2){
  // Takes a value intended for print, if it's got a lot of decimal places it tidies up
  // Just spit it back out if the value isn't some primitive
  if(typeof primitive == "object" || typeof primitive == "function"){
    return primitive;
  }
  // Try converting to numeric and formatting accordingly
  try {
    var numeric = parseFloat(primitive);
    var decimals = numeric - Math.floor(numeric);
    if (decimals != 0.0) {
      if (Math.abs(numeric) < 1.0) {
        return numeric.toPrecision(significance);
      }
      return numeric.toFixed(significance);
    }
    else {
      return parseInt(primitive);
    }
  }
  catch (err) {
    pass;
  }
  return primitive;
}


function createTraces(data, seriesColumns, xColumn="date", hoverColumn=null, traceType="scatter", lineFill=false) {
  // Utility, unpacks a data structure into an array of trace objects for
  // use with plotly
  var traces = [];

  for(let i = 0; i < seriesColumns.length; i++) {
    var name = seriesColumns[i];
    // Sanity check columns are not x axis or hover text
    if(name == xColumn) {continue; }
    if(name == hoverColumn) {continue; }
    trace = {
      name: prettifyVariableName(name),
      type: traceType,
      x: unpack(data, xColumn),
      y: unpack(data, name)
    }
    // Optional fill
    if (lineFill == true) {
      console.log("here");
      trace['fill'] = 'tonexty';
    }
    // Optional hovertext column
    if (!hoverColumn == false) {
      trace['text'] = unpack(data, hoverColumn).map(element => element.toString() + " " + hoverColumn);
    }
    traces.push(trace);
  }
  return traces;
}

function writeDictToTable(dict, div_id, wipe=true) {
  // Takes a dict (Javascript Object with only data) and creates HTML table in a div
  // Adapted from https://stackoverflow.com/a/30616912
  var target_div = document.getElementById(div_id);
  if (wipe) {
    target_div.textContent = '';
  }

  var table = document.createElement('TABLE');
  table.setAttribute("class", "tabulate_output");

  var table_body = document.createElement('TBODY');
  table.appendChild(table_body);

  for (const [key, value] of Object.entries(dict)) {
    var tr = document.createElement('TR');
    table_body.appendChild(tr);
    var td1 = document.createElement('TD'); td1.appendChild(document.createTextNode(prettifyVariableName(key)));
    var td2 = document.createElement('TD'); td2.appendChild(document.createTextNode(prettifyNumber(value)));
    tr.appendChild(td1);
    tr.appendChild(td2);
  }
  target_div.appendChild(table);
  return null;
}

function reload(elementId){
    // Forces the refresh of an element
    // From https://stackoverflow.com/a/10914389
    var container = document.getElementById(elementId);
    var content = container.innerHTML;
    container.innerHTML= content;

   // Confirm
    console.log("Refreshed");
}
