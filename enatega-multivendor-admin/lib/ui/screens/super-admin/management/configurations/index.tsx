// Components
import ConfigHeader from '@/lib/ui/screen-components/protected/super-admin/configuration/view/header';
import ConfigMain from '@/lib/ui/screen-components/protected/super-admin/configuration/view/main';
import NoData from '@/lib/ui/useable-components/no-data';

export default function ConfigurationsScreen() {
  return (
    <div className="screen-container">
      <ConfigHeader />
      <ConfigMain />
    </div>
  );
}
