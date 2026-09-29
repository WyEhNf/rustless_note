import type {ComponentPropsWithoutRef} from 'react';

// Reading pages use normal document navigation, including when JavaScript is unavailable.
export default function ReadingLink(props:ComponentPropsWithoutRef<'a'>){
 return <a {...props}/>;
}
