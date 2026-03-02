import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ExternalLink, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTodo } from '@/contexts/TodoContext';
import type { Workspace } from '@/types/todo';

interface WorkspacesPageProps {
  theme?: 'clean' | 'retro';
}

const ICONS = ['💼', '💻', '🎨', '🎯', '🚀', '📊', '🔧', '📝', '🎮', '🎵', '📚', '🌐'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const WorkspacesPage: React.FC<WorkspacesPageProps> = ({ theme = 'clean' }) => {
  const { userData, addWorkspace, updateWorkspace, deleteWorkspace } = useTodo();
  const workspaces: Workspace[] = useMemo(() => userData.workspaces || [], [userData.workspaces]);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('💼');
  const [color, setColor] = useState(COLORS[0]);
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isRetro = theme === 'retro';
  const cardClass = isRetro
    ? 'border-2 border-black dark:border-gray-600 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] rounded-xl'
    : 'border rounded-lg';

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('💼');
    setColor(COLORS[0]);
    setUrlInput('');
    setUrls([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddUrl = () => {
    const raw = urlInput.trim();
    if (!raw) return;
    const url = raw.startsWith('http') ? raw : `https://${raw}`;
    setUrls(prev => [...prev, url]);
    setUrlInput('');
  };

  const handleSave = () => {
    if (!name.trim() || urls.length === 0) return;
    if (editingId) {
      updateWorkspace(editingId, { name: name.trim(), description: description.trim(), icon, color, urls });
    } else {
      addWorkspace(name.trim(), icon, color, urls, description.trim() || undefined);
    }
    resetForm();
  };

  const handleEdit = (ws: Workspace) => {
    setName(ws.name);
    setDescription(ws.description || '');
    setIcon(ws.icon);
    setColor(ws.color);
    setUrls(ws.urls);
    setEditingId(ws.id);
    setShowForm(true);
  };

  const handleLaunch = (ws: Workspace) => {
    ws.urls.forEach(url => window.open(url, '_blank', 'noopener,noreferrer'));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isRetro ? 'font-black' : ''}`}>🖥️ Workspaces</h1>
          <p className="text-muted-foreground text-sm mt-1">Group your tabs and tools. Launch everything in one click.</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(v => !v); }}>
          <Plus className="w-4 h-4 mr-1" /> New Workspace
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className={cardClass}>
          <CardHeader><CardTitle className="text-base">{editingId ? 'Edit Workspace' : 'New Workspace'}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Workspace name (e.g. Dev Setup)" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />

            <div>
              <p className="text-xs text-muted-foreground mb-1">Icon</p>
              <div className="flex flex-wrap gap-2">
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setIcon(ic)}
                    className={`text-xl p-1 rounded ${icon === ic ? 'ring-2 ring-blue-500' : ''}`}>{ic}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Color</p>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">URLs to open</p>
              <div className="flex gap-2">
                <Input placeholder="https://github.com" value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddUrl()} />
                <Button size="sm" variant="outline" onClick={handleAddUrl}>Add</Button>
              </div>
              {urls.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {urls.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="truncate flex-1">{u}</span>
                      <button onClick={() => setUrls(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="w-3 h-3 text-muted-foreground hover:text-red-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={!name.trim() || urls.length === 0}>
                {editingId ? 'Save Changes' : 'Create Workspace'}
              </Button>
              <Button size="sm" variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workspace Cards */}
      {workspaces.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🖥️</p>
          <p className="font-medium mb-1">No workspaces yet</p>
          <p className="text-sm">Create a workspace to group your tabs and launch them with one click.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map(ws => (
            <Card key={ws.id} className={`${cardClass} group`} style={{ borderTopColor: ws.color, borderTopWidth: 3 }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ws.icon}</span>
                    <div>
                      <p className="font-semibold">{ws.name}</p>
                      {ws.description && <p className="text-xs text-muted-foreground">{ws.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(ws)} className="text-muted-foreground hover:text-foreground text-xs px-1">Edit</button>
                    <button onClick={() => deleteWorkspace(ws.id)} className="text-muted-foreground hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  {ws.urls.slice(0, 4).map((url, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                    </div>
                  ))}
                  {ws.urls.length > 4 && (
                    <p className="text-xs text-muted-foreground pl-4">+{ws.urls.length - 4} more</p>
                  )}
                </div>

                <Button size="sm" className="w-full" onClick={() => handleLaunch(ws)}>
                  <Play className="w-3 h-3 mr-1" /> Launch ({ws.urls.length} tab{ws.urls.length !== 1 ? 's' : ''})
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkspacesPage;
