import { useState } from 'react';
import { Button, Modal, SettingsPanel } from '@/ui';

interface Props {
  open: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  missionTitle: string;
  objective: string;
}

export function PauseMenu({ open, onResume, onRestart, onQuit, missionTitle, objective }: Props) {
  const [view, setView] = useState<'menu' | 'settings' | 'confirm-quit' | 'confirm-restart'>('menu');
  const close = () => {
    setView('menu');
    onResume();
  };
  return (
    <Modal open={open} onClose={close} title={view === 'settings' ? 'Settings' : 'Paused'} description={view === 'menu' ? `${missionTitle} — ${objective}` : undefined} size={view === 'settings' ? 'lg' : 'sm'}>
      {view === 'menu' && (
        <div className="flex flex-col gap-3">
          <Button variant="primary" size="lg" block onClick={close} autoFocus>
            Resume
          </Button>
          <Button variant="secondary" block onClick={() => setView('settings')}>
            Settings
          </Button>
          <Button variant="secondary" block onClick={() => setView('confirm-restart')}>
            Restart mission
          </Button>
          <Button variant="danger" block onClick={() => setView('confirm-quit')}>
            Quit to menu
          </Button>
        </div>
      )}
      {view === 'settings' && (
        <div className="flex flex-col gap-4">
          <SettingsPanel compact />
          <Button variant="secondary" onClick={() => setView('menu')}>
            Back
          </Button>
        </div>
      )}
      {(view === 'confirm-quit' || view === 'confirm-restart') && (
        <div className="flex flex-col gap-3">
          <p className="text-fg-muted">{view === 'confirm-quit' ? 'Leave the mission? Progress in this run will be lost.' : 'Restart from the beginning of the mission?'}</p>
          <Button
            variant="danger"
            block
            onClick={() => {
              setView('menu');
              if (view === 'confirm-quit') onQuit();
              else onRestart();
            }}
          >
            {view === 'confirm-quit' ? 'Quit' : 'Restart'}
          </Button>
          <Button variant="secondary" block onClick={() => setView('menu')}>
            Cancel
          </Button>
        </div>
      )}
    </Modal>
  );
}
