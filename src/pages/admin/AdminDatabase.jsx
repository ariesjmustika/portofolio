import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, AlertTriangle, Database, CheckCircle2, Trash2, Copy, Terminal } from 'lucide-react';
import Swal from 'sweetalert2';
import EditorModule from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism-tomorrow.css';
import { supabase } from '../../lib/supabaseClient';
import './AdminDatabase.css';

// Handle ESM/CJS interop issues with Vite
const Editor = EditorModule.default || EditorModule;

const AdminDatabase = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleExecute = async () => {
    if (!query.trim()) return;

    const confirm = await Swal.fire({
      title: 'Execute SQL?',
      text: "Running direct SQL can modify or drop your database tables. Proceed with caution!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Execute'
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    setResult(null);

    try {
      // Calls the custom RPC function created in Supabase
      const { data, error } = await supabase.rpc('execute_sql', { sql_query: query });
      
      if (error) throw error;
      
      setResult({
        success: true,
        data: data || 'Query executed successfully. No data returned.'
      });
      Swal.fire('Success', 'SQL Query executed successfully!', 'success');
    } catch (err) {
      console.error(err);
      setResult({
        success: false,
        error: err.message
      });
      Swal.fire('Execution Failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-database">
      <div className="section-header">
        <div className="title-group">
          <Database className="text-accent" size={28} />
          <div>
            <h2>SQL Command Center</h2>
            <p className="text-secondary">Direct database manipulation via RPC</p>
          </div>
        </div>
      </div>

      <motion.div 
        className="admin-card database-card" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="danger-banner">
          <div className="banner-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="banner-content">
            <h4>Security Warning</h4>
            <p>Direct SQL execution is powerful and dangerous. Always backup data before running DDL commands.</p>
          </div>
        </div>

        <div className="editor-container">
          <div className="editor-toolbar">
            <div className="toolbar-left">
              <Terminal size={16} />
              <span>query.sql</span>
            </div>
            <div className="toolbar-right">
              <button onClick={() => { setQuery(''); setResult(null); }} title="Clear Editor">
                <Trash2 size={16} />
              </button>
              <button onClick={() => { navigator.clipboard.writeText(query); Swal.fire({title:'Copied!', timer:1000, showConfirmButton:false}); }} title="Copy SQL">
                <Copy size={16} />
              </button>
            </div>
          </div>
          
          <Editor
            value={query}
            onValueChange={code => setQuery(code)}
            highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
            padding={20}
            placeholder="-- Type your SQL here..."
            className="sql-prism-editor"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: '14px',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              minHeight: '300px',
              outline: 'none'
            }}
          />
        </div>

        <div className="editor-footer">
          <p className="hint">Shortcut: Cmd/Ctrl + Enter to run</p>
          <button 
            type="button" 
            className="run-btn" 
            onClick={handleExecute}
            disabled={loading || !query.trim()}
          >
            {loading ? <div className="loader-sm"></div> : <Play size={18} />}
            <span>{loading ? 'Executing...' : 'Execute Query'}</span>
          </button>
        </div>
      </motion.div>

      {result && (
        <motion.div 
          className={`result-card ${result.success ? 'success' : 'error'}`}
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="result-header">
            <div className="result-status">
              {result.success ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
              <span>{result.success ? 'Query Successful' : 'Execution Failed'}</span>
            </div>
          </div>
          <div className="result-body">
            <pre>
              {typeof result.data === 'string' ? result.data : JSON.stringify(result.success ? result.data : result.error, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDatabase;
