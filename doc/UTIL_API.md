# Eruda Util Documentation

## evalCss

Load css into page.

|Name  |Desc         |
|------|-------------|
|css   |Css code     |
|return|Style element|

```javascript
evalCss('body{background:#08c}');
```

## isErudaEl

Check if value is eruda container element.

|Name  |Desc                                    |
|------|----------------------------------------|
|val   |Value to check                          |
|return|True if value is eruda container element|

```javascript
isErudaEl(document.body); // -> false
```