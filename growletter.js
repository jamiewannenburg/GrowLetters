// create one new brach given a line
function branch(line)
{
  var angle = Math.random()*Math.PI/4 - Math.PI/10;
  var ratio = Math.random()*0.9;
  var ov = line[1].subtract(line[0]);
  var bv = ov.x(ratio);
  var lv = bv.x(ratio);
  var rot_mat = $M([ [Math.cos(angle) , - Math.sin(angle)],
      [Math.sin(angle) , Math.cos(angle)] ]);
  bv = rot_mat.x(bv);
  lv = rot_mat.x(rot_mat.x(lv));
  mp = line[0].add(ov.x(Math.random()*0.7));
  line1 = [mp,mp.add(bv)];
  line2 = [mp.add(bv),mp.add(bv).add(lv)];
  return [line1,line2];
}

// get all the streight lines of the letter given in key and grow a fractal patern from them streight lines in path object
// and append them to the path object.
function grow(key,path) {
  // get line segments of character if they exist.
  var big_string = "";
  if (key && key in helvetica) {
            path.setAttribute('d',helvetica[key]);
            big_string=helvetica[key];
        }
  var segments = path.pathSegList;

  var lines = new Array();
  var l_count = 0;
  var current_point = $V([0,0]);

  for (var i=0, len=segments.numberOfItems; i<len; ++i){
    var segment=segments.getItem(i);
    switch(segment.pathSegType){
      case SVGPathSeg.PATHSEG_MOVETO_ABS:
        current_point = $V([segment.x, segment.y]);
      break;
      case SVGPathSeg.PATHSEG_LINETO_ABS:
        var n_vec = $V([segment.x, segment.y]);
        lines[l_count] = [current_point,n_vec];
        current_point = n_vec;
        l_count += 1;
      break;
      case SVGPathSeg.PATHSEG_LINETO_REL:
        var n_vec = $V([current_point.e(1) + segment.x, current_point.e(2) + segment.y]);
        lines[l_count] = [current_point,n_vec];
        current_point = n_vec;
        l_count += 1;
      break;
      case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
        var n_vec = $V([segment.x, current_point.e(2)]);
        lines[l_count] = [current_point,n_vec];
        current_point = n_vec;
        l_count += 1;
      break;
      
      case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
        var n_vec = $V([current_point.e(1) + segment.x, current_point.e(2)]);
        lines[l_count] = [current_point,n_vec];
        current_point = n_vec;
        l_count += 1;
      break;
      case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
        var n_vec = $V([current_point.e(1), segment.y]);
        lines[l_count] = [current_point,n_vec];
        current_point = n_vec;
        l_count += 1;
      break;
      case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
        var n_vec = $V([current_point.e(1), current_point.e(2)+ segment.y]);
        lines[l_count] = [current_point,n_vec];
        current_point = n_vec;
        l_count += 1;
      break;
    }
    
  }
  //console.log(lines);

  // grow 
  var depth = 5;
  for (var i=0; i<depth; i++) {
    var new_lines = [];
    for (var j=0; j < lines.length; j++){
      var line = lines[j];
      add_lines = branch(line);
      big_string +=
          'M' + add_lines[0][0].e(1)+50 + ',' + (add_lines[0][0].e(2)) +
          'L' + add_lines[0][1].e(1)+50 + ',' + (add_lines[0][1].e(2)) +
          'M' + add_lines[1][0].e(1)+50 + ',' + (add_lines[1][0].e(2)) +
          'L' + add_lines[1][1].e(1)+50 + ',' + (add_lines[1][1].e(2));
      new_lines = new_lines.concat(add_lines);
      
    }
    lines = new_lines;
  }
  path.setAttribute('d', big_string);
}

