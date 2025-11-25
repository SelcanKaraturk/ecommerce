<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

        @viteReactRefresh
        @vite('resources/js/react/src/main.jsx')

    </head>
    <body class="">
        <div id="root"></div>
        
    </body>
    <!-- jQuery önce -->
    {{-- <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script> --}}
    <script src="//{{ request()->getHost() }}/assets/js/vendor/jquery-3.6.0.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/vendor/bootstrap.bundle.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/plugins/jquery.sticky-sidebar.js"></script>
    {{-- -------------- --}}
    <script src="//{{ request()->getHost() }}/assets/js/plugins/countdown.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/plugins/scroll-top.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/plugins/jquery.counterup.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/plugins/theia-sticky-sidebar.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/plugins/timecircles.min.js"></script>
    <script src="//{{ request()->getHost() }}/assets/js/plugins/mailchimp-ajax.js"></script>
    {{-- -------------------------- --}}

    <script src="//{{ request()->getHost() }}/assets/js/main.js"></script>
</html>
