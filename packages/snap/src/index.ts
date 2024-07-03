import type { OnNameLookupHandler } from '@metamask/snaps-sdk';
import { Clusters } from '@clustersxyz/sdk';

const clusters = new Clusters({ apiKey: 'metamask-snap' });

export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { address, domain } = request;

  if (address) {
    const findClusterName = await clusters.getName(address);
    if (!findClusterName) return null;

    return {
      resolvedDomains: [
        { resolvedDomain: findClusterName, protocol: 'Clusters' },
      ],
    };
  }

  if (!domain) return null;

  if (domain.includes('/')) {
    const findAddress = await clusters.getAddress(domain);
    if (findAddress && findAddress.type === 'evm') {
      return {
        resolvedAddresses: [
          {
            resolvedAddress: findAddress.address,
            protocol: 'Clusters',
          },
        ],
      };
    }
  }

  return null;
};
