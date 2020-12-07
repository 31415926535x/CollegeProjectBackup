import mdui from '../../mdui';
import { CollapseAbstract } from './collapseAbstract';
class Collapse extends CollapseAbstract {
    getNamespace() {
        return 'collapse';
    }
}
mdui.Collapse = Collapse;
