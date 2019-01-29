function merge(arr, l, m, r) {
  var i, j, k;
  var n1 = m - l + 1;
  var n2 = r - m;

  var L = new Array(n1);
  var R = new Array(n2);

  for (i = 0; i < n1; i++) L[i] = arr[l + i];
  for (j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

  i = 0;
  j = 0;
  k = l;

  while (i < n1 && j < n2) {
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    k++;
  }

  while (i < n1) {
    arr[k] = L[i];
    i++;
    k++;
  }

  while (j < n2) {
    arr[k] = R[j];
    j++;
    k++;
  }
}

onmessage = function(e) {
  var sab = e.data[0];
  var start = e.data[1];
  var middle = e.data[2];
  var end = e.data[3];
  var uint16Array = new Uint16Array(sab);
  merge(uint16Array, start, middle, end);
  postMessage('done');
};
