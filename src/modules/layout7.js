// src/modules/layout7.js
import { comp01 } from '../components/comp01.js'
import { comp02 } from '../components/comp02.js'
import { comp03 } from '../components/comp03.js'
import { comp04 } from '../components/comp04.js'
import { comp05 } from '../components/comp05.js'
import { comp06 } from '../components/comp06.js'
import { comp07 } from '../components/comp07.js'

export function renderLayout7(root) {
  root.innerHTML = `
    <div class="grid-7">
      ${comp01()}
      ${comp02()}
      ${comp03()}
      ${comp04()}
      ${comp05()}
      ${comp06()}
      ${comp07()}
    </div>
  `;
}
