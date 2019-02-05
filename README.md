# Comparision of a Normal Merge Sort and Distributed Merge Sort is used.

**Normal Merge Sort**: It is done in the main thread (the only thread)
, basic implementaion of merge sort. <br /><br />

**Distributed Merge Sort**: It is done in the worker threads, by using
at max 4 worker threads at a time. Merge Sorting 1/4 of part array in
different workers. Then merging the 4 parts, in two different workers by
making it parallel. Thereby speeding it up.

Using
<a
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"
        >SharedArrayBuffer</a
      >, we can easily send reference to the worker threads without the overhead
of copying over. Combining
<a
        href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers"
        >Web Workers</a
      >
and
<a
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer"
        >SharedArrayBuffer</a
      >,We can implement a lot of parallel algorithms, achieve speed which was
possible in low level languages. Also read,
<a
        href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays"
        >TypedArrays</a
      >
which makes numerical arrays creation superfast.

** Note **  
Check this issue https://github.com/tc39/security/issues/3
Limited browser support for SharedArrayBuffer .
