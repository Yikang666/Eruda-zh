export default [
    {
        name: 'Location',
        val: location.href
    },
    {
        name: 'User Agent',
        val: navigator.userAgent
    },
    {
        name: 'Device',
        val: `<table>
                  <tbody>
                      <tr>
                          <td>screen</td>
                          <td>${screen.width} * ${screen.height}</td>
                      </tr>
                      <tr>
                          <td>viewport</td>
                          <td>${window.innerWidth} * ${window.innerHeight}</td>
                      </tr>
                      <tr>
                          <td>pixel ratio</td>
                          <td>${window.devicePixelRatio}</td>
                      </tr>
                  </tbody>
              </table>`

    },
    {
        name: 'About',
        val: '<a href="https://github.com/liriliri/eruda" target="_blank">Eruda v' + VERSION + '</a>'
    }
];
