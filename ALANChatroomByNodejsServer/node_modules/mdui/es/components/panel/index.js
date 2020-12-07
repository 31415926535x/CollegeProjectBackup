import mdui from '../../mdui';
import { CollapseAbstract } from '../collapse/collapseAbstract';
class Panel extends CollapseAbstract {
    getNamespace() {
        return 'panel';
    }
}
mdui.Panel = Panel;
