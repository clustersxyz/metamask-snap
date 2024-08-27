import { Clusters } from '@clustersxyz/sdk';
import type {
  OnNameLookupHandler,
  OnTransactionHandler,
} from '@metamask/snaps-sdk';
import { panel, heading, text, row, address } from '@metamask/snaps-sdk';

const clusters = new Clusters({ apiKey: 'metamask-snap' });

export const onNameLookup: OnNameLookupHandler = async (request) => {
  const { address, domain } = request;

  if (address) {
    const findClusterName = await clusters.getName(address);
    if (!findClusterName) {
      return null;
    }

    return {
      resolvedDomains: [
        { resolvedDomain: findClusterName, protocol: 'Clusters' },
      ],
    };
  }

  if (!domain) {
    return null;
  }

  if (domain.includes('/')) {
    const findAddress = await clusters.getAddress(domain);
    if (findAddress && findAddress.type === 'evm') {
      return {
        resolvedAddresses: [
          {
            resolvedAddress: findAddress.address,
            domainName: domain,
            protocol: 'Clusters',
          },
        ],
      };
    }
  }

  return null;
};

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  if (transaction.to) {
    const findClusterName = await clusters.getName(transaction.to);
    const clusterName = findClusterName || 'n/a';

    return {
      content: panel([
        heading('Recipient Insights'),
        row('Cluster', text(clusterName)),
        row('Address', address(transaction.to as `0x${string}`)),
      ]),
    };
  } else {
    return null;
  }
};
