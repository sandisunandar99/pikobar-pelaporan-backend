const render = (data) => {
  return [
    {
      colSpan: 4,
      table: {
        widths: [250, 250],
        body: [
          [
            { text: 'Pneumonia (Klinis atau Radiologi)', border: [] },
            { text: `: [  ] Ya   [  ] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: 'ARDS (Acute Respiratory Distress Syndrome)', border: [] },
            { text: `: [  ] Ya   [  ] Tdk  [  ] Tdk tahu `, border: [] },
          ],
          [
            { text: `Diagnosis lainnya, Sebutkan!`, margin: [0, 0, 0, 5], border: [] },
            { text: ': ...', margin: [0, 0, 0, 5], border: [] },
          ],
          [
            { text: 'Apakah pasien mempunyai diagnosis atau', margin: [0, 5, 0, 0], border: ['', 'black', '', ''] },
            { text: `: [  ] Ya   [  ] Tdk  [  ] Tdk tahu `, margin: [0, 5, 0, 0], border: ['', 'black', '', ''] },
          ],
          [
            { text: 'etiologi lain untuk penyakit pernafasannya?', border: [] },
            { text: ': ...', border: [] },
          ],
          [
            { text: `Jika Ya, Sebutkan!`, border: [] },
            { text: ': ...', border: [] },
          ],
        ],
      },
      layout: {
        paddingLeft: (i, node) => 0,
        paddingTop: (i, node) => -0.2,
        paddingBottom: (i, node) => 0
      }
      // 
    },{},{},{}
  ]
}

module.exports = {
  render
}