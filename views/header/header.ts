import { Token } from '../../source/redux/types';

$('#selector').on('switch', function setHeaderLinks(
    ev, { token }: { token: Token }
) {
    $('#menu>a').each((_, a) => {
        const href = $(a).attr('href');
        if (href) $(a).attr('href', href.replace(
            /token=([A-Z]+)/, `token=${token}`
        ));
    });
});
