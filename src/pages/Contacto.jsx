import { Card } from '../components/ui.jsx';
import { Icon } from '../components/Icon.jsx';

const TELEFONO = '963407212';
const EMAIL = 'sergius16ht@gmail.com';

export function Contacto() {
  return (
    <div className="flex flex-col gap-lg max-w-96">
      <h1 className="text-2xl font-bold">Contacto</h1>
      <p className="text-on-surface-variant text-sm">
        Soporte del sistema — EpziTech.
      </p>

      <Card className="flex flex-col gap-0">
        <div className="flex items-center justify-between py-sm">
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-mono">Teléfono</p>
            <p className="text-lg font-semibold">{TELEFONO}</p>
          </div>
          <div className="flex gap-sm">
            <a
              href={`tel:${TELEFONO}`}
              className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              aria-label="Llamar"
            >
              <Icon name="call" />
            </a>
            <a
              href={`https://wa.me/51${TELEFONO}`}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center"
              aria-label="WhatsApp"
            >
              <Icon name="chat" />
            </a>
          </div>
        </div>

        <div className="border-t border-outline-variant py-sm flex items-center gap-sm">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
            <Icon name="mail" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase font-mono">Correo electrónico</p>
            <p className="text-lg font-semibold break-all">{EMAIL}</p>
          </div>
        </div>
      </Card>

      <a
        href={`https://wa.me/51${TELEFONO}`}
        target="_blank"
        rel="noreferrer"
        className="min-h-[56px] rounded-full bg-secondary text-on-secondary font-semibold flex items-center justify-center gap-sm hover:opacity-90"
      >
        <Icon name="chat" />
        Contactar por WhatsApp
      </a>
    </div>
  );
}
