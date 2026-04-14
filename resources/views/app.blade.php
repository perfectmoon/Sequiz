<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Sequiz</title>
  @viteReactRefresh
  @vite(['resources/js/app.jsx'])
  @inertiaHead
</head>
<body>
  @inertia 
</body>
</html>
