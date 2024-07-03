import { describe, it } from '@jest/globals';
import type { ChainId } from '@metamask/snaps-sdk';

import { onNameLookup } from '.';

const DOMAIN_MOCK = 'clusters/';
const ADDRESS_MOCK = '0x00000000000e1a99dddd5610111884278bdbda1d';
const CHAIN_ID_MOCK = 'eip155:1' as ChainId;

describe('onNameLookup', () => {
  it('returns resolved address if domain', async () => {
    const request = {
      domain: DOMAIN_MOCK,
      chainId: CHAIN_ID_MOCK,
    };

    expect(await onNameLookup(request)).toStrictEqual({
      resolvedAddresses: [
        {
          resolvedAddress: '0x5755d1dcea21caa687339c305d143e6e78f96adf',
          protocol: 'Clusters',
          domainName: 'clusters/',
        },
      ],
    });
  });

  it('returns resolved domain if address', async () => {
    const request = {
      address: ADDRESS_MOCK,
      chainId: CHAIN_ID_MOCK,
    };

    expect(await onNameLookup(request)).toStrictEqual({
      resolvedDomains: [
        { resolvedDomain: 'clusters/protocol', protocol: 'Clusters' },
      ],
    });
  });

  // it('returns resolved domain if address and domain', async () => {
  //   const request = {
  //     address: ADDRESS_MOCK,
  //     domain: DOMAIN_MOCK,
  //     chainId: CHAIN_ID_MOCK,
  //   } as any;

  //   expect(await onNameLookup(request)).toStrictEqual({
  //     resolvedDomains: [{ resolvedDomain: 'clusters/', protocol: 'Clusters' }],
  //   });
  // });

  it('returns null if no domain or address', async () => {
    const request = {
      chainId: CHAIN_ID_MOCK,
    };

    // @ts-expect-error - Testing invalid request.
    expect(await onNameLookup(request)).toBeNull();
  });
});
