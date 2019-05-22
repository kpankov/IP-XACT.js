$('a[target=_blank]').on('click', function () {
    require('nw.gui').Shell.openExternal(this.href);
    return false;
});
