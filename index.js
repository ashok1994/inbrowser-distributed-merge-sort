var normSortingBtn = document.getElementById('norm-sorting-btn');
var distSortingBtn = document.getElementById('dist-sorting-btn');
var normStatus = document.getElementById('norm-status');
var distStatus = document.getElementById('dist-status');
var statuses = ['Not running', 'Creating Array', 'Running', 'Completed!'];
var normStats = {
  arraySize: null,
  startTime: null,
  endTime: null,
  totalTime: null
};

var dStats = {
  arraySize: null,
  startTime: null,
  endTime: null,
  totalTime: null,
  workerStat: false
};

function promisifyWorker(worker, data) {
  return new Promise((resolve, reject) => {
    worker.onmessage = function(e) {
      console.log('resolved');
      resolve(e);
    };
    worker.onerror = function(err) {
      reject(err);
    };
    worker.postMessage(data);
  });
}

function randomFiller(view, minValue, maxValue) {
  for (var i = 0; i < view.length; i++) {
    view[i] = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  }
}

function startDistributed() {
  distStatus.innerText = statuses[1];
  var sab = new SharedArrayBuffer(20000000);
  var uint16View = new Uint16Array(sab);
  randomFiller(uint16View, 10, 32767);

  var worker1 = new Worker('worker.js');
  var worker2 = new Worker('worker.js');
  var worker3 = new Worker('worker.js');
  var worker4 = new Worker('worker.js');
  var mWorker1 = new Worker('merge-worker.js');
  var mWorker2 = new Worker('merge-worker.js');
  performance.mark('merge-start');
  distStatus.innerText = statuses[2];
  dStats.arraySize = uint16View.length;

  dStats.startTime = Date.now();

  Promise.all([
    promisifyWorker(worker1, [sab, 0, 2499999]),
    promisifyWorker(worker2, [sab, 2500000, 4999999]),
    promisifyWorker(worker3, [sab, 5000000, 7499999]),
    promisifyWorker(worker4, [sab, 7500000, 9999999])
  ])
    .then(function() {
      return Promise.all([
        promisifyWorker(mWorker1, [uint16View, 0, 2499999, 4999999]),
        promisifyWorker(mWorker2, [uint16View, 5000000, 7499999, 9999999])
      ]);
    })
    .then(function(d) {
      merge(uint16View, 0, 4999999, 9999999);
      dStats.endTime = Date.now();
      dStats.totalTime = dStats.endTime - dStats.startTime;
      performance.mark('merge-end');
      distStatus.innerText = statuses[3];
      updateDStats();
      distSortingBtn.removeAttribute('disabled');
      performance.measure('d-merge-sort', 'merge-start', 'merge-end');
    });
}

function updateNormStats() {
  document.getElementById('norm-stats').style.display = 'block';
  document.getElementById('n-start-time').innerText = normStats.startTime;
  document.getElementById('n-end-time').innerText = normStats.endTime;
  document.getElementById('n-total-time').innerText =
    normStats.totalTime + ' (' + normStats.totalTime / 1000.0 + 's)';
  document.getElementById('n-array-size').innerText = normStats.arraySize;
}

function updateDStats() {
  document.getElementById('dist-stats').style.display = 'block';
  document.getElementById('d-start-time').innerText = dStats.startTime;
  document.getElementById('d-end-time').innerText = dStats.endTime;
  document.getElementById('d-total-time').innerText =
    dStats.totalTime + ' (' + dStats.totalTime / 1000.0 + 's)';
  document.getElementById('d-array-size').innerText = dStats.arraySize;
}

function startNormalMergeSort() {
  normStatus.innerText = statuses[1];
  var sab = new SharedArrayBuffer(20000000);
  var uint16View = new Uint16Array(sab);
  randomFiller(uint16View, 10, 32767);
  normStatus.innerText = statuses[2];
  setTimeout(function() {
    performance.mark('merge-start');
    normStats.startTime = Date.now();
    mergeSort(uint16View, 0, uint16View.length - 1);
    normStats.endTime = Date.now();
    performance.mark('merge-end');
    performance.measure('merge-sort', 'merge-start', 'merge-end');
    normStatus.innerText = statuses[3];
    normStats.arraySize = uint16View.length;
    normStats.totalTime = normStats.endTime - normStats.startTime;
    updateNormStats();
    normSortingBtn.removeAttribute('disabled');
  }, 500);
}

normSortingBtn.addEventListener('click', function() {
  this.setAttribute('disabled', 'disabled');
  // Set to not running
  normStatus.innerHTML = statuses[0];
  setTimeout(function() {
    startNormalMergeSort();
  }, 200);
});

distSortingBtn.addEventListener('click', function() {
  this.setAttribute('disabled', 'disabled');
  distStatus.innerHTML = statuses[0];
  setTimeout(function() {
    startDistributed();
  }, 200);
});
