# Train/test splits of the NIR AutoML 71-task benchmark

Test rows for the 44 tasks that have no published split: the 10 datasets of
the first NIR post (`initial/`) and 34 nirs4all datasets (`nirs4all/`). The 27
NIRBENCH-DL tasks use NIRBENCH-DL's own published split and are not repeated
here.

These files contain no spectra and no reference values, only row positions.
Get the data from the original sources listed in the post.

## File format

One JSON file per task:

- `seed`, `test_fraction`, `method`: how the split was drawn. Rows are sorted
  by the reference value and cut into blocks of 1 / `test_fraction` rows; one
  row per block, drawn with the seed, goes to test.
- `row_order`: what the row positions count.
  - `source rows with a value, file order`: rows of the source file that have
    a value for the property, in file order (initial set).
  - `data.csv rows with a value`: the same for the nirs4all `data.csv`.
  - `groups sorted by id, replicates averaged`: nirs4all datasets whose
    `groups.csv` holds sample ids. Rows with a value are averaged per group;
    groups are sorted by id.
- `test_rows`: zero-based positions of the test rows in that order. Every
  other row is a training row.

nirs4all datasets: https://github.com/GBeurier/nirs4all-datasets
