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
                          <td>${screen.width}px * ${screen.height}px</td>
                      </tr>
                      <tr>
                          <td>viewport</td>
                          <td>${window.innerWidth}px * ${window.innerHeight}px</td>
                      </tr>
                      <tr>
                          <td>pixel ratio</td>
                          <td>${window.devicePixelRatio}</td>
                      </tr>
                  </tbody>
              </table>`

    }
];
