class TodoApp {
  constructor(key) {
    this.key = key;
    this.todos = JSON.parse(localStorage.getItem(key) || '[]');
    this.form = document.getElementById('formularz');
    this.text = document.getElementById('zadania');
    this.date = document.getElementById('data');
    this.list = document.getElementById('lista');
    this.search = document.getElementById('wyszukaj');
    this.clear = document.getElementById('clearSearch');

    this.form.onsubmit = e => (e.preventDefault(), this.add());
    this.search.oninput = () => this.render();
    this.clear.onclick = () => ((this.search.value = ''), this.render());
    this.render();
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.todos));
  }

  add() {
    const t = this.text.value.trim(), d = this.date.value;
    if (!t || !d) return;
    this.todos.unshift({ id: Date.now(), text: t, date: d });
    this.save();
    this.form.reset();
    this.render();
  }

  remove(id) {
    this.todos = this.todos.filter(x => x.id !== id);
    this.save();
    this.render();
  }

  update(id, t, d) {
    const z = this.todos.find(x => x.id === id);
    if (!z) return;
    z.text = t;
    z.date = d;
    this.save();
    this.render();
  }

  highlight(txt, q) {
    if (!q) return txt;
    const r = new RegExp(`(${q})`, 'gi');
    return txt.replace(r, '<span class="highlight">$1</span>');
  }

  render() {
    const q = this.search.value.trim().toLowerCase();
    this.list.innerHTML = '';
    if (!this.todos.length) return (this.list.innerHTML = '<li>Brak zadań</li>');
    this.todos.forEach(z => {
      if (q && !z.text.toLowerCase().includes(q)) return;
      const li = document.createElement('li');
      const txt = document.createElement('span');
      txt.innerHTML = this.highlight(`${z.text} (${z.date})`, q);

      const edit = document.createElement('button');
      edit.textContent = 'Edytuj';
      edit.className = 'btn-edit';
      edit.onclick = () => this.edit(li, z);

      const del = document.createElement('button');
      del.textContent = 'Usuń';
      del.className = 'btn-delete';
      del.onclick = () => this.remove(z.id);

      li.append(txt, edit, del);
      this.list.append(li);
    });
  }

  edit(li, z) {
    li.innerHTML = '';
    const i = document.createElement('input');
    i.value = z.text;
    i.className = 'edit-input';
    const d = document.createElement('input');
    d.type = 'date';
    d.value = z.date;
    d.className = 'edit-date';

    const save = document.createElement('button');
    save.textContent = 'Zapisz';
    save.className = 'btn-save';
    save.onclick = () => this.update(z.id, i.value.trim(), d.value);

    const cancel = document.createElement('button');
    cancel.textContent = 'Anuluj';
    cancel.className = 'btn-cancel';
    cancel.onclick = () => this.render();

    li.append(i, d, save, cancel);
    i.focus();
  }
}

new TodoApp('todos_v1');
