import React, { useEffect } from 'react';
import * as THREE from 'three';

const ThreeJSShader = ({ containerRef }) => {
  useEffect(() => {
    let camera, scene, renderer;
    let uniforms;

    const container = containerRef.current;

    // Initialize the scene, camera, and renderer
    init();

    function init() {
      // Camera, scene, and geometry setup
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      scene = new THREE.Scene();
      const geometry = new THREE.PlaneGeometry(2, 2);

      // Shader uniforms
      uniforms = {
        time: { value: 1.0 }
      };

      // Shader material (vertex & fragment shaders)
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
      });

      // Mesh with the shader material
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // WebGL renderer setup
      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setAnimationLoop(animate);

      // Append renderer to DOM
      container.appendChild(renderer.domElement);

      // Handle window resizing
      window.addEventListener('resize', onWindowResize);
    }

    // Handle window resizing
    function onWindowResize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // Animate the scene (update time uniform)
    function animate() {
      uniforms['time'].value = performance.now() / 1000;
      renderer.render(scene, camera);
    }

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };

  }, [containerRef]);

  return (
    <div>
      <script id="vertexShader" type="x-shader/x-vertex">
        {`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = vec4( position, 1.0 );
          }
        `}
      </script>

      <script id="fragmentShader" type="x-shader/x-fragment">
        {`
          varying vec2 vUv;
          uniform float time;

          void main() {
            vec2 p = - 1.0 + 2.0 * vUv;
            float a = time * 40.0;
            float d, e, f, g = 1.0 / 40.0 ,h ,i ,r ,q;

            e = 400.0 * ( p.x * 0.5 + 0.5 );
            f = 400.0 * ( p.y * 0.5 + 0.5 );
            i = 200.0 + sin( e * g + a / 150.0 ) * 20.0;
            d = 200.0 + cos( f * g / 2.0 ) * 18.0 + cos( e * g ) * 7.0;
            r = sqrt( pow( abs( i - e ), 2.0 ) + pow( abs( d - f ), 2.0 ) );
            q = f / r;
            e = ( r * cos( q ) ) - a / 2.0;
            f = ( r * sin( q ) ) - a / 2.0;
            d = sin( e * g ) * 176.0 + sin( e * g ) * 164.0 + r;
            h = ( ( f + d ) + a / 2.0 ) * g;
            i = cos( h + r * p.x / 1.3 ) * ( e + e + a ) + cos( q * g * 6.0 ) * ( r + h / 3.0 );
            h = sin( f * g ) * 144.0 - sin( e * g ) * 212.0 * p.x;
            h = ( h + ( f - e ) * q + sin( r - ( a + h ) / 7.0 ) * 10.0 + i / 4.0 ) * g;
            i += cos( h * 2.3 * sin( a / 350.0 - q ) ) * 184.0 * sin( q - ( r * 4.3 + a / 12.0 ) * g ) + tan( r * g + h ) * 184.0 * cos( r * g + h );
            i = mod( i / 5.6, 256.0 ) / 64.0;
            if ( i < 0.0 ) i += 4.0;
            if ( i >= 2.0 ) i = 4.0 - i;
            d = r / 350.0;
            d += sin( d * d * 8.0 ) * 0.52;
            f = ( sin( a * g ) + 1.0 ) / 2.0;
            gl_FragColor = vec4( vec3( f * i / 1.6, i / 2.0 + d / 13.0, i ) * d * p.x + vec3( i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i ) * d * ( 1.0 - p.x ), 1.0 );
          }
        `}
      </script>
    </div>
  );
};

export default ThreeJSShader;
